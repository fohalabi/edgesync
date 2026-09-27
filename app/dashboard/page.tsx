import EdgeDashboard from "../components/EdgeDashboard"
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/login?next=/dashboard');

    return (
        <main>
            <EdgeDashboard user={session} />
        </main>
    )
}
