import { Request, Response } from 'express';
import { FeeReportingService } from '../services/feeReportingService';
import { EmailService } from '../services/emailService';

export class AdminReportController {
  constructor(
    private reportingService: FeeReportingService,
    private emailService: EmailService
  ) {}

  async generateReport(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,
        format = 'PDF',
        groupBy = 'day',
        includeDetails = true,
        email
      } = req.body;

      const report = await this.reportingService.generateReport({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        format,
        groupBy,
        includeDetails
      });

      if (email) {
        await this.emailService.sendReportEmail({
          to: email,
          reportPath: report,
          startDate,
          endDate
        });

        return res.json({
          message: 'Report has been generated and emailed successfully'
        });
      }

      // For PDF/CSV, stream the file
      if (typeof report === 'string') {
        res.download(report);
      } else {
        res.json(report);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMonthlySummary(req: Request, res: Response) {
    try {
      const { month, year } = req.params;

      const summary = await this.reportingService.generateMonthlySummary(
        parseInt(month),
        parseInt(year)
      );

      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomReport(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,
        metrics,
        breakdowns,
        sortBy,
        limit
      } = req.body;

      const report = await this.reportingService.generateCustomReport({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        metrics,
        breakdowns,
        sortBy,
        limit
      });

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
