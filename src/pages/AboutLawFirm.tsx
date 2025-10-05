import React from "react";

const AboutLawFirm: React.FC = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">About Our Firm</h1>
    <div className="bg-white rounded-xl border border-gray-300 shadow p-6 text-black flex flex-col md:flex-row items-center gap-8">
  <img src="/kumara-swami.jpg" alt="Advocate S. Kumara Swami" className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow" />
      <div>
        <h2 className="text-2xl font-semibold mb-4">✨ Meet Advocate S. Kumara Swami — The Rising Force in Law ✨</h2>
        <ul className="space-y-4 text-lg">
          <li>📚 With a strong foundation in Commerce (B.Com) and a professional edge sharpened through an LL.B, Kumara Swami stands at the perfect intersection of business acumen and legal expertise.</li>
          <li>⚖️ He brings a practical, real-world approach to every case, backed not just by textbooks but by an intuitive grasp of how law and commerce blend in everyday disputes.</li>
          <li>🚀 Known for his clarity in basics and sharp problem-solving mindset, he’s the guy who can cut through complicated legal jargon and deliver straightforward, winning strategies.</li>
          <li>💡 Whether it’s contracts, property matters, or civil disputes, his ability to break things down to the fundamentals makes him the go-to advocate for those who want results without confusion.</li>
          <li>🗣️ Clients appreciate his calm confidence, his ability to listen deeply, and his talent for turning even the toughest challenges into manageable solutions.</li>
          <li>🌟 He’s not just another advocate — he’s a future pillar in the legal fraternity, someone who combines the discipline of commerce, the precision of law, and the determination of a visionary.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default AboutLawFirm;
