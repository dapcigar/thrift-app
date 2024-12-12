import CreateGroupForm from '@/components/GroupCreationForm';
import MemberManagement from '@/components/MemberManagement';
import PaymentForm from '@/components/PaymentForm';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <PaymentForm
              groupName="Family Savings"
              dueAmount={100}
              dueDate="2024-12-15"
              onSubmitPayment={async () => {}}
            />
          </div>
          
          <div>
            <MemberManagement
              members={[
                {
                  id: '1',
                  name: 'John Doe',
                  email: 'john@example.com',
                  role: 'ADMIN',
                  status: 'ACTIVE'
                }
              ]}
              onInviteMember={async () => {}}
              onRemoveMember={async () => {}}
              onUpdateRole={async () => {}}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <CreateGroupForm onSubmit={async () => {}} />
        </div>
      </div>
    </div>
  );
}