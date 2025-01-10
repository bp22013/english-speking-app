import confetti from 'canvas-confetti';

export const handleCanon = () => {
    const end = Date.now() + 0.5 * 1000; // 0.5 seconds
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]; // ランダムな色を取得

    const frame = () => {
        if (Date.now() > end) return;

        confetti({
            particleCount: 1,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: [getRandomColor()], // ランダムな色を選択
        });
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: [getRandomColor()], // ランダムな色を選択
        });
        confetti({
            particleCount: 1,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: [getRandomColor()], // ランダムな色を選択
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: [getRandomColor()], // ランダムな色を選択
        });

        requestAnimationFrame(frame);
    };

    frame();
};
