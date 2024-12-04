/* WebSpeechApiのライブラリ */

import toast from "react-hot-toast";

export const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // 英語（アメリカ）
        speechSynthesis.speak(utterance);
    } else {
        toast.error('このブラウザでは合成音声は使用できません');
    }
};
