interface DashboardStatCardProps {
    label: string;
    value: number | string;
    description?: string;
}

export function DashboardStatCard({
                                      label,
                                      value,
                                      description,
                                  }: DashboardStatCardProps) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold">
                {value}
            </p>

            {description && (
                <p className="mt-1 text-sm text-zinc-500">
                    {description}
                </p>
            )}
        </div>
    );
}
