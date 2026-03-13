import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: '개인정보 처리방침 | STRAIGHT LAB',
  description: '스트레이트랩 개인정보 처리방침',
};

const SECTIONS = [
  {
    title: '제1조 (개인정보의 처리 목적)',
    content: `스트레이트랩(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 학원 마케팅 무료 진단 서비스 제공
2. 마케팅 견적 및 전략 제안서 제공
3. 무료 상담 신청 접수 및 상담 연결
4. 서비스 관련 공지사항 전달
5. 회원 가입 및 서비스 이용 관리`,
  },
  {
    title: '제2조 (처리하는 개인정보의 항목)',
    content: `회사는 다음의 개인정보 항목을 처리하고 있습니다.

▸ 무료 진단·상담 신청 시
  - 필수: 학원명, 담당자명, 휴대폰 번호
  - 선택: 이메일 주소

▸ 회원 가입 시
  - 필수: 이메일 주소, 비밀번호, 이름
  - 자동 수집: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보`,
  },
  {
    title: '제3조 (개인정보의 처리 및 보유 기간)',
    content: `① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.

  - 상담 신청 정보: 상담 완료 후 3년 (분쟁 해결, 민원 처리)
  - 회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존 필요 시 해당 기간)
  - 서비스 이용 기록: 3개월

③ 전자상거래 등에서의 소비자 보호에 관한 법률에 의한 보존:
  - 계약 또는 청약철회에 관한 기록: 5년
  - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년`,
  },
  {
    title: '제4조 (개인정보의 제3자 제공)',
    content: `회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

현재 회사는 정보주체의 개인정보를 제3자에게 제공하고 있지 않습니다.`,
  },
  {
    title: '제5조 (개인정보처리의 위탁)',
    content: `① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

  - 수탁자: Supabase Inc.
  - 위탁 업무: 회원 인증, 데이터베이스 관리 및 저장
  - 보유 및 이용 기간: 위탁 계약 종료 시까지

  - 수탁자: SOLAPI (또는 Twilio)
  - 위탁 업무: 휴대폰 본인인증 문자 발송
  - 보유 및 이용 기간: 인증 완료 후 즉시 파기

② 회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.`,
  },
  {
    title: '제6조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)',
    content: `① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.

  1. 개인정보 열람 요구
  2. 오류 등이 있을 경우 정정 요구
  3. 삭제 요구
  4. 처리정지 요구

② 제1항에 따른 권리 행사는 회사에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.

③ 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.`,
  },
  {
    title: '제7조 (개인정보의 안전성 확보 조치)',
    content: `회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.

1. 개인정보 취급 직원의 최소화 및 교육
   개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.

2. 개인정보의 암호화
   이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.

3. 해킹 등에 대비한 기술적 대책
   회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.

4. 접속기록의 보관 및 위변조 방지
   개인정보처리시스템에 접속한 기록을 최소 1년 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.`,
  },
  {
    title: '제8조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)',
    content: `회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.

① 쿠키의 사용 목적
  이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.

② 쿠키의 설치·운영 및 거부
  웹브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.`,
  },
  {
    title: '제9조 (개인정보 보호책임자)',
    content: `① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

  ▸ 개인정보 보호책임자
  - 성명: 박트로이 (대표)
  - 직책: 대표
  - 연락처: contact@straightlab.kr

② 정보주체께서는 회사의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.`,
  },
  {
    title: '제10조 (개인정보 처리방침 변경)',
    content: `① 이 개인정보처리방침은 2025년 1월 1일부터 적용됩니다.

② 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
  - 해당 없음 (최초 시행)

③ 개인정보처리방침이 변경되는 경우 변경 사항을 최소 7일 전에 공지사항을 통하여 고지할 것입니다.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-black/10 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" prefetch={false} className="hover:opacity-60 transition-opacity">
            <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={130} height={36} className="h-8 w-auto" unoptimized />
          </Link>
          <Link href="/" prefetch={false} className="text-xs text-[#888888] hover:text-[#111111] transition-colors uppercase tracking-widest">
            홈으로
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-14 border-b border-black/10 pb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#111111]" />
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em]">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-[#111111] tracking-tight mb-3">개인정보 처리방침</h1>
          <p className="text-sm text-[#888888]">
            스트레이트랩(STRAIGHT LAB)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
          <p className="text-xs text-[#AAAAAA] mt-3">시행일: 2025년 1월 1일 · 최종 수정일: 2026년 3월 13일</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section, i) => (
            <div key={i} className="border-l-2 border-[#111111] pl-6">
              <h2 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">{section.title}</h2>
              <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact box */}
        <div className="mt-16 border border-black/15 p-8 bg-[#F5F5F5]">
          <p className="text-xs font-black text-[#111111] uppercase tracking-widest mb-2">개인정보 관련 문의</p>
          <p className="text-sm text-[#555555]">
            개인정보 처리방침과 관련한 문의사항은 아래 이메일로 연락주시기 바랍니다.
          </p>
          <p className="text-sm font-bold text-[#111111] mt-2">contact@straightlab.kr</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-[#0A0A0A] border-t border-white/5 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={100} height={28} className="h-7 w-auto brightness-0 invert opacity-40" unoptimized />
          <p className="text-[#555555] text-xs">© 2025 STRAIGHT LAB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
