import { DashboardContent } from '@orc/web/components/dashboard/dashboard-client';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  // Todo: auth required
  // const user = await getCurrentUser();
  //
  // if (!user) {
  //   redirect(authOptions?.pages?.signIn || '/login');
  // }

  return (
    <>
      <DashboardContent />
    </>
  );
}
