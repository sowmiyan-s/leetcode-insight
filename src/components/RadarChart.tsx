import { useMemo } from 'react';

interface RadarChartProps {
    data: {
        consistency: number;
        legitimacy: number;
        diversity: number;
        complexity: number;
        accuracy: number;
    };
    size?: number;
    showLabels?: boolean;
    className?: string;
    securityColor?: string;
}

export const RadarChart = ({ data, size = 200, showLabels = true, className = "", securityColor = "primary" }: RadarChartProps) => {
    const center = size / 2;

    const r = size * 0.30; // Significantly reduced to ensure labels fit (22%)

    const axes = [
        { label: 'Consistency', value: data.consistency },
        { label: 'Legitimacy', value: data.legitimacy },
        { label: 'Diversity', value: data.diversity },
        { label: 'Complexity', value: data.complexity },
        { label: 'Accuracy', value: data.accuracy },
    ];

    const getPoint = (index: number, value: number) => {
        const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
        const dist = (value / 100) * r;
        const padding = 40;
        return `${center + padding + dist * Math.cos(angle)},${center + padding + dist * Math.sin(angle)}`;
    };

    const radarPath = useMemo(() => axes.map((a, i) => getPoint(i, a.value)).join(' '), [data, size]);

    // Calculate dynamic viewBox to fit all labels
    const padding = 40; // Extra padding for labels
    const viewBoxSize = size + padding * 2;
    const viewBoxCenter = viewBoxSize / 2;

    return (
        <div className={`relative ${className}`}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="drop-shadow-2xl"
                style={{ maxWidth: size + padding * 2, maxHeight: size + padding * 2, width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
            >
                {/* Grid */}
                {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
                    <polygon
                        key={scale}
                        points={axes.map((_, i) => getPoint(i, 100 * scale)).join(' ')}
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity={0.4}
                        strokeWidth="1.5"
                        className="text-white"
                    />
                ))}

                {/* Data Path */}
                <polygon
                    points={radarPath}
                    fill="rgba(249, 115, 22, 0.2)"
                    stroke="rgba(249, 115, 22, 1)"
                    strokeWidth="3"
                />

                {/* Labels & Dots */}
                {axes.map((a, i) => {
                    const pts = getPoint(i, a.value).split(',');
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const padding = 40;

                    // Label Position
                    const labelDist = r + 15;
                    const lx = center + padding + labelDist * Math.cos(angle);
                    const ly = center + padding + labelDist * Math.sin(angle);

                    let anchor: "start" | "middle" | "end" = 'middle';
                    if (Math.abs(Math.cos(angle)) > 0.1) {
                        if (Math.cos(angle) > 0) anchor = 'start';
                        else anchor = 'end';
                    }

                    // Adjust y for top/bottom labels
                    let dy = "0.3em";
                    if (Math.sin(angle) < -0.9) dy = "0"; // Top
                    if (Math.sin(angle) > 0.9) dy = "0.8em"; // Bottom

                    return (
                        <g key={i}>
                            <circle cx={pts[0]} cy={pts[1]} r="3" fill="#ffffff" />
                            {showLabels && (
                                <text
                                    x={lx}
                                    y={ly}
                                    dy={dy}
                                    textAnchor={anchor}
                                    fill="#ffffff"
                                    style={{ fontSize: Math.max(10, size / 22), fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                >
                                    {a.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
