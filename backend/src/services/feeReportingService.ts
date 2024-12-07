import { ServiceFee } from '../models/ServiceFee';
import { Group } from '../models/Group';
import { User } from '../models/User';
import { createObjectCsvWriter } from 'csv-writer';
import { formatCurrency } from '../utils/helpers';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

export class FeeReportingService {
  private async getTopPerformingGroups(startDate: Date, endDate: Date) {
    return await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: '$groupId',
          totalFees: { $sum: '$feeAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalFees: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'group'
        }
      }
    ]);
  }

  private async getDailyTrends(startDate: Date, endDate: Date) {
    return await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalFees: { $sum: '$feeAmount' },
          count: { $sum: 1 },
          averageFee: { $avg: '$feeAmount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
  }

  private async generatePDFReport(summary: any, details: any | null) {
    const doc = new PDFDocument();
    const filePath = `/tmp/fee-report-${Date.now()}.pdf`;
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add header
    doc.fontSize(20).text('Fee Report', { align: 'center' });
    doc.moveDown();

    // Add summary section
    doc.fontSize(16).text('Summary', { underline: true });
    doc.moveDown();

    summary.forEach((item: any) => {
      doc.fontSize(12).text(
        `${item._id}: ${formatCurrency(item.totalFees)} (${item.transactionCount} transactions)`
      );
    });

    // Add details if included
    if (details) {
      doc.addPage();
      doc.fontSize(16).text('Transaction Details', { underline: true });
      doc.moveDown();

      details.forEach((item: any) => {
        doc.fontSize(10).text(
          `${new Date(item.createdAt).toLocaleDateString()} - ${item.userId.firstName} ${item.userId.lastName} - ${formatCurrency(item.feeAmount)}`
        );
      });
    }

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      writeStream.on('error', reject);
    });
  }

  private async generateCSVReport(summary: any, details: any | null) {
    const filePath = `/tmp/fee-report-${Date.now()}.csv`;

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'date', title: 'DATE' },
        { id: 'totalFees', title: 'TOTAL FEES' },
        { id: 'transactionCount', title: 'TRANSACTIONS' },
        { id: 'averageFee', title: 'AVERAGE FEE' }
      ]
    });

    const records = summary.map((item: any) => ({
      date: item._id,
      totalFees: formatCurrency(item.totalFees),
      transactionCount: item.transactionCount,
      averageFee: formatCurrency(item.averageFee)
    }));

    await csvWriter.writeRecords(records);

    if (details) {
      // Write details to a separate CSV
      const detailsFilePath = `/tmp/fee-report-details-${Date.now()}.csv`;
      const detailsCsvWriter = createObjectCsvWriter({
        path: detailsFilePath,
        header: [
          { id: 'date', title: 'DATE' },
          { id: 'user', title: 'USER' },
          { id: 'group', title: 'GROUP' },
          { id: 'amount', title: 'FEE AMOUNT' },
          { id: 'status', title: 'STATUS' }
        ]
      });

      const detailRecords = details.map((item: any) => ({
        date: new Date(item.createdAt).toLocaleDateString(),
        user: `${item.userId.firstName} ${item.userId.lastName}`,
        group: item.groupId.name,
        amount: formatCurrency(item.feeAmount),
        status: item.status
      }));

      await detailsCsvWriter.writeRecords(detailRecords);

      return {
        summary: filePath,
        details: detailsFilePath
      };
    }

    return filePath;
  }
}
