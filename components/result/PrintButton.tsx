'use client';

import { useState, RefObject } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';

interface PrintButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export default function PrintButton({ contentRef }: PrintButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [hagwonName, setHagwonName] = useState('');

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `${hagwonName || '학원'}_마케팅_견적서`,
  });

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#E94560] hover:bg-[#c73550] text-white font-bold py-4 rounded-xl transition-all"
      >
        <Download className="w-5 h-5" />
        견적서 PDF 다운로드
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-[#0F3460] mb-4">견적서에 표시할 학원명</h3>
            <input
              type="text"
              placeholder="예: OO수학학원"
              value={hagwonName}
              onChange={(e) => setHagwonName(e.target.value)}
              className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0F3460] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-medium"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handlePrint();
                }}
                className="flex-1 py-3 bg-[#0F3460] text-white rounded-xl font-medium"
              >
                PDF 다운로드
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
