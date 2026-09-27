import EdgeDashboard from "../components/EdgeDashboard"
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getDashboardAnalytics } from '@/lib/analytics';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/login?next=/dashboard');

    const analytics = await getDashboardAnalytics();
    return (
        <main>
            <EdgeDashboard user={session} analytics={analytics} />
        </main>
    )
}
