/* 成績グラフ表示用コンポーネント */

'use client';

import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts';
import { Spinner } from '@nextui-org/react';

interface LevelStats {
    level: string;
    unanswered: number;
    correct: number;
    incorrect: number;
}

interface StudentIdProps {
    studentId: string;
}

export const AssignedQuestionsStats: React.FC<StudentIdProps> = (props) => {
    const [stats, setStats] = useState<LevelStats[]>([]);
    const [isLoading, setisLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // グラフのデータを取得する関数
    useEffect(() => {
        const fetchStats = async () => {
            if (!props.studentId) return; // props.studentIdが処理中で空の時にfetchしてしまうのを防止する

            try {
                const response = await fetch('/api/achievement/student', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ studentId: props.studentId }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                setStats(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'データの取得に失敗しました');
            } finally {
                setisLoading(false);
            }
        };

        fetchStats();
    }, [props.studentId]);

    // ローディング画面の実装
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner label="トレーニングの成績を取得中..." color="success" />
            </div>
        );
    }

    // エラー画面の実装
    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // 合計値の計算をする関数
    const totals = stats.reduce(
        (acc, curr) => ({
            unanswered: acc.unanswered + curr.unanswered,
            correct: acc.correct + curr.correct,
            incorrect: acc.incorrect + curr.incorrect,
        }),
        { unanswered: 0, correct: 0, incorrect: 0 }
    );

    // 値に「問」を付ける関数
    const valueFormatter = (value: number | null) =>{
        return `${value}問`;
    }

    return (
        <div className="space-y-8">
            <div className="mb-10">
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">{totals.unanswered}</p>
                        <p className="text-sm text-gray-600">未回答</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{totals.correct}</p>
                        <p className="text-sm text-gray-600">正解</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">{totals.incorrect}</p>
                        <p className="text-sm text-gray-600">不正解</p>
                    </div>
                </div>
            </div>

            <div className="gap-4">
                <BarChart
                    series={[
                        {
                            data: stats.map((s) => s.unanswered),
                            label: '未回答',
                            color: '#3B82F6',
                            valueFormatter,
                        },
                        {
                            data: stats.map((s) => s.correct),
                            label: '正解',
                            color: '#22C55E',
                            valueFormatter,
                        },
                        {
                            data: stats.map((s) => s.incorrect),
                            label: '不正解',
                            color: '#EF4444',
                            valueFormatter,
                        },
                    ]}
                    xAxis={[
                        {
                            data: stats.map((s) => s.level),
                            scaleType: 'band',
                        },
                    ]}
                    height={400}
                    margin={{ top: 70, right: 10, bottom: 40, left: 70 }}
                />
            </div>
        </div>
    );
};

export default AssignedQuestionsStats;
