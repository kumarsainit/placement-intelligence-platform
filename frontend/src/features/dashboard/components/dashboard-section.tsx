import type { ReactNode } from "react";

interface DashboardSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function DashboardSection({
                                     title,
                                     description,
                                     children,
                                 }: DashboardSectionProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-zinc-500">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </section>
    );
}
