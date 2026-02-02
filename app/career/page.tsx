"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type OverallStatus = "operational" | "degraded" | "outage" | "loading";

function StatusIndicator() {
  const [status, setStatus] = useState<OverallStatus>("loading");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.overall))
      .catch(() => setStatus("outage"));
  }, []);

  const config = {
    loading: { color: "bg-[#8b949e]", text: "checking..." },
    operational: { color: "bg-[#3fb950]", text: "operational" },
    degraded: { color: "bg-[#d29922]", text: "degraded" },
    outage: { color: "bg-[#f85149]", text: "outage" },
  };

  const { color, text } = config[status];

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-[#8b949e]">
      <span
        className={`h-2 w-2 rounded-full ${color} ${status === "loading" ? "animate-pulse" : ""}`}
      />
      <span>{text}</span>
    </div>
  );
}

interface WorkItem {
  text: string;
  subItems?: string[];
}

interface Project {
  title: string;
  subtitle: string;
  period: string;
  company: string;
  works: WorkItem[];
  achievement: string;
}

const projects: Project[] = [
  {
    title: "NOL 채널 내재화 (임베딩)",
    subtitle:
      "TPS 20만 설계 목표로 고성능 백엔드 시스템을 처음부터 설계하고 전체 구현을 주도하여, 2단계 방어 캐싱 전략(Thundering Herd Problem 해결)로 카탈로그 조회 응답 시간을 500ms에서 200ms로 60% 단축했습니다.",
    period: "2025.08 - 2025.11",
    company: "NOL Universe",
    works: [
      {
        text: "TPS 20만 대응 고성능 백엔드 시스템 아키텍처 설계 및 전체 구현 주도 (설계~배포 End-to-End 리드)",
        subItems: [
          "Datadog APM 분석: 기존 채널 대비 5~6배 트래픽 증가 예상, 타임딜 이벤트 기존 TPS 3~5만 확인 → TPS 20만 설계 목표 수립",
          "인프라팀/DBA 협업: ECS Auto Scaling 여부에 따른 MongoDB Connection Pool 적정치 산정 (Scale-out 시 max 64, 기본 시 max 32)",
          "ECS 서비스 Auto Scaling, MongoDB Auto Scaling 설정으로 트래픽 급증 시 자동 확장",
        ],
      },
      {
        text: "Redis 2단계 방어 캐싱 전략 설계 (Thundering Herd Problem 해결)",
        subItems: [
          "전시 서비스 (버티컬 도메인) TTL 10분 일괄 만료 시 모든 요청이 상품 서비스로 집중되는 순간 부하 폭증 문제 인식",
          "상품 서비스에 Look-Aside 패턴 기반 2차 방어 캐시 구축 (TTL 1분): 첫 요청 1번만 DB 조회, 이후 캐시 응답으로 DB 부하 최소화",
          "TTL 1분으로 데이터 freshness 확보하면서도 Look-Aside 패턴으로 DB 쿼리 1번만 실행",
        ],
      },
      {
        text: "NOL 채널 결제 연동 (채널별 결제 MID 설정 및 기존 빌링/쿠폰 시스템에 NOL 채널 추가 통합)",
      },
      {
        text: "채널별 알림톡 분기 아키텍처 설계 및 구현 (LG CNS / CJ Mplace 이중화 체계)",
      },
      {
        text: "User-Agent 직접 파싱을 통한 예약 경로 트래킹 시스템 자체 구현 (외부 라이브러리 미사용)",
      },
      {
        text: "Databricks 기반 결제 및 쿠폰 대사 대시보드 구축",
        subItems: [
          "NOL 결제 시스템과 자사 빌링 시스템 간 결제 내역 대사 쿼리 작성",
          "쿠폰 발급/사용/환불 내역 정합성 검증 및 불일치 데이터 추출 자동화",
          "일간 대사 리포트 생성으로 재무 데이터 정합성 모니터링 체계 구축",
        ],
      },
    ],
    achievement:
      "인프라팀과 협업하여 Datadog APM 기반 트래픽 분석을 수행하고, 기존 채널 대비 5~6배 증가 예측 및 타임딜 이벤트 기존 TPS 3~5만 확인 후 TPS 20만을 설계 목표로 수립하여 고성능 아키텍처를 구축했습니다. 2단계 방어 캐싱 전략으로 Thundering Herd Problem을 해결했습니다. 전시 서비스 (버티컬 도메인)의 일괄 TTL 10분 만료로 인한 순간 부하 폭증을 방어하기 위해, 상품 서비스에 Look-Aside 패턴 기반 TTL 1분의 2차 방어 캐시를 구축하여 첫 요청 1번만 DB 조회 후 나머지는 캐시 응답으로 처리했습니다. 인프라팀/DBA와 협업하여 ECS Auto Scaling 여부에 따른 MongoDB Connection Pool 적정치를 산정했습니다 (Scale-out 시 max 64, 기본 시 max 32로 리소스 효율성과 성능의 균형점 도출). 그 결과 카탈로그 조회 응답 시간을 500ms에서 200ms로 60% 단축했습니다. Databricks 기반으로 NOL 결제 시스템과 자사 빌링 시스템 간 결제 내역 대사 및 쿠폰 발급/사용/환불 정합성 검증 자동화를 구축하여 재무 데이터의 무결성을 확보하고 일간 대사 리포트로 운영 안정성을 강화했습니다.",
  },
  {
    title: "인솔자 예약 및 여행 그룹 시스템",
    subtitle:
      "인솔자 관리와 여행 그룹 관리 시스템을 처음부터 설계하고 구현하여, 복수 예약을 하나의 그룹으로 관리할 수 있는 시스템을 구축했습니다.",
    period: "2025.05 - 2025.08",
    company: "NOL Universe",
    works: [
      {
        text: "인솔자/파트너 관리 시스템 구축 및 파트너 타입 확장 (인솔자/가이드/현지업체)",
      },
      { text: "여행 그룹과 예약 간 할당/해제 시스템 전체 설계 및 구현" },
      { text: "파트너 어드민 서비스 전체 개발 (React)" },
      { text: "패신저 리스트 엑셀 다운로드 기능 구현 (대용량 최적화)" },
      { text: "출발 확정서 도메인 이관 및 알림톡 자동 발송" },
      {
        text: "알림톡 기반 파트너 인증 시스템 전체 구축 (인솔자/가이드/현지업체 담당자 핸드폰 인증)",
      },
    ],
    achievement:
      "여행 그룹 도메인을 처음부터 설계하며 예약과의 N:M 관계를 매핑 테이블로 연결하는 구조를 제안하고 구현했습니다. 패신저 리스트는 별도 테이블 없이 예약 데이터 기반으로 동적 생성하여 데이터 정합성을 유지했습니다. 파트너 어드민 서비스를 React로 개발하여 인솔자/가이드/현지업체가 직접 여행 그룹을 관리할 수 있도록 했으며, 알림톡 기반 핸드폰 인증으로 파트너별 접근 제어를 구현했습니다.",
  },
  {
    title: "신규 빌링 시스템",
    subtitle:
      "레거시 분석부터 신규 시스템 설계/구현까지 전체 프로세스를 주도하여, 100개 이상의 복잡한 환불 케이스를 Strategy 패턴으로 해결하고 무중단 시스템 전환을 완료했습니다.",
    period: "2025.03 - 2025.05",
    company: "NOL Universe",
    works: [
      {
        text: "레거시 시스템 분석 및 환불 케이스 전체 분류 (예약금/잔금 × PG/포인트/쿠폰 조합 100개+ 케이스)",
        subItems: [
          "결제 수단별 환불 우선순위 매트릭스 설계 및 안분 규칙 전체 정의",
          "Strategy 패턴 기반 취소 안분 서비스 아키텍처 설계 및 전체 구현 주도",
        ],
      },
      {
        text: "결제 동시성 제어 시스템 설계 및 구현 (예약번호 + 결제항목 조합 기반 분산 락)",
        subItems: [
          "3단계 결제 프로세스: 결제 시작 → 결제 승인 유효성 검증 → 결제 승인 단계별 동시성 제어",
          "예약당 N번 결제 가능 + 여행자/예약자 동시 결제 가능 구조에서 Race Condition 방지",
          '예약번호 단위가 아닌 "예약번호 + 결제항목" 조합으로 락 키 설계하여 세밀한 동시성 제어',
        ],
      },
      {
        text: "레거시 결제 데이터 호환성 확보 및 무중단 전환 전략 수립",
        subItems: [
          "신규 빌링 시스템이 레거시 빌링 데이터를 직접 읽어 처리하는 구조 설계로 별도 마이그레이션 작업 불필요",
          "피처 플래그로 기존/신규 시스템 동적 제어하며 단계적 트래픽 전환으로 무중단 배포 완료",
        ],
      },
      { text: "원단위 정수 처리 로직 설계로 부동소수점 오차 완전 제거" },
    ],
    achievement:
      '레거시 시스템의 복잡한 환불 로직을 체계적으로 분석하여 예약금/잔금, PG/포인트/쿠폰 조합에 따른 100개 이상의 케이스를 완전히 문서화하고 정리했습니다. Strategy 패턴을 적용하여 결제 수단별 환불 전략을 독립적으로 분리했으며, 새로운 결제 수단 추가 시 기존 코드 수정 없이 확장 가능하도록 설계했습니다(OCP 원칙 준수). 결제 동시성 제어 시스템을 구축하여 예약당 N번 결제 가능 및 여행자/예약자 동시 결제 상황에서 발생할 수 있는 Race Condition을 완전히 방지했습니다. 예약번호 단위가 아닌 "예약번호 + 결제항목" 조합으로 락 키를 설계하여 세밀한 동시성 제어를 달성했고, 결제 시작 → 유효성 검증 → 승인의 3단계 프로세스에서 각 단계별로 원자성을 보장했습니다. 신규 빌링 시스템이 레거시 빌링 데이터를 직접 읽어 처리하는 구조로 설계하여 별도 마이그레이션 작업 없이 기존 데이터 호환성을 확보했으며, 피처 플래그로 기존/신규 시스템을 동적으로 제어하며 단계적 전환으로 무중단 배포를 완료했습니다. 원단위 정수 처리로 부동소수점 오차를 원천 차단하여 환불 금액 정확도 100% 달성했으며, 고객 클레임 제로를 유지하며 안정적인 서비스 전환을 완수했습니다.',
  },
  {
    title: "모두투어 상품 연동",
    subtitle:
      "외부 공급사 관리를 위한 3개 서비스(수집 / 조회 / 예약)로 관심사를 분리 설계하고, 모두투어 상품 컨텐츠를 Geotag/Google Place ID 기반으로 자사 컨텐츠와 자동 매핑하여 일관된 사용자 경험을 제공했습니다.",
    period: "2024.06 - 2024.09",
    company: "인터파크트리플",
    works: [
      {
        text: "공급사 관리 서비스 아키텍처 설계 및 3개 서비스 신규 구축",
        subItems: [
          "package-supplier-collect: 상품 정보 수집 서비스 (배치 기반 데이터 동기화)",
          "package-supplier-product: 실시간 상품 정보 조회 서비스 (package-product가 호출)",
          "package-supplier: 연동사 예약 및 기타 연동 서비스",
          "3개 인스턴스 유형으로 분리하여 각 서비스별로 독립적인 스케일링 가능",
        ],
      },
      {
        text: "모두투어 상품 연동 및 자사 상품 변환",
        subItems: [
          "모두투어 상품 API 연동 및 데이터 동기화 배치 개발",
          "모두투어 상품 데이터 구조 → 자사 상품 스키마로 변환",
        ],
      },
      {
        text: "상품 컨텐츠 자동 매핑 시스템 구축",
        subItems: [
          "모두투어 관광지/POI 데이터 → 자사 관광지/POI 컨텐츠 자동 연결",
          "Geotag 좌표 기반 유사도 매칭 알고리즘 구현",
          "Google Place ID 기반 정확도 매칭 시스템 구현",
          "IATA 코드 기반 지역 코드 매핑 처리",
          "미매칭 발생 시 실시간 알림 및 수동 검증 프로세스 운영",
        ],
      },
      {
        text: "예약 연동 시스템 구축",
        subItems: ["자동 재시도 3회 및 실패 시 수기예약 전환 프로세스"],
      },
    ],
    achievement:
      "외부 공급사 상품 연동을 위한 3개 서비스 아키텍처를 설계하고 전체 구현했습니다. 수집 / 조회 / 예약 관심사를 분리하여 각 서비스가 독립적으로 배포 및 확장 가능한 구조를 확보했으며, 모두투어를 시작으로 향후 다양한 공급사 확장 기반을 마련했습니다. 모두투어 관광지/POI를 자사 컨텐츠 DB와 자동 매핑하는 시스템을 구축하여 외부 상품이 자사 플랫폼의 일관된 컨텐츠로 제공되도록 했습니다. Geotag 좌표 기반 유사도 매칭과 Google Place ID 기반 정확도 매칭을 결합하여 관광지 자동 연결 정확도를 확보했으며, IATA 코드 기반 지역 코드 매핑으로 도시/지역 분류를 자동화했습니다. 미매칭 발생 시 실시간 알림 및 수동 검증 프로세스를 운영하여 데이터 품질을 관리했고, 지역 정보 자동 주입으로 검색 노출 문제를 완전히 해결하여 상품 노출률을 향상시켰습니다.",
  },
  {
    title: "해외 패키지 신규 플랫폼 개발",
    subtitle:
      "MSA 기반 패키지 플랫폼을 처음부터 설계하고 개발하여, 투어/항공 서비스와의 결합형 상품 구조를 구축하고 Kinesis/SQS 기반 이벤트 아키텍처로 서비스 간 느슨한 결합을 달성했습니다.",
    period: "2023.05 - 2024.05",
    company: "인터파크트리플",
    works: [
      {
        text: "MSA 기반 패키지 플랫폼 아키텍처 설계 및 전체 서비스 개발 주도",
        subItems: [
          "상품 서비스: 투어 서비스(투어상품/호텔상품) + 항공 서비스(항공상품)를 연동하여 결합형 패키지 상품 구조 설계 및 구현",
          "예약 서비스: 예약/여행자 정보 관리(여권 이미지 업로드 포함), 동시성 제어, 재고 관리 시스템 구축",
          "검색 서비스: 상품 검색 및 카탈로그 시스템 구축",
          "배치 서비스: 잔금 TL, 대기예약 처리, 출발확정 등 운영 자동화",
          "이벤트 수신 로직을 별도 서버로 분리하여 시스템 의존성 감소",
        ],
      },
      {
        text: "복잡한 도메인 설계 및 비즈니스 로직 구현",
        subItems: [
          "투어상품/투어텔상품/동일행사 등 복잡한 도메인 전체 설계 및 API 개발",
          "아이템별 포함/불포함 사항, 옵션 아이템화 기능 전체 구현",
          "호텔 객실 예약과 직접적으로 연관되는 호텔 객실 기준인원 계산 및 각 아이템(투어, 호텔, 교통)의 최소 출발인원을 계산하여 출발 확정시키는 출발확정 알고리즘 개발",
          "추가 할인 시스템 전체 설계 및 구축 (결제/환불/알림톡 연동)",
          "취소 로직을 상품 타입별로 Service 클래스로 분리하고 Factory 패턴으로 적절한 Service 선택",
        ],
      },
      {
        text: "이벤트 기반 아키텍처 설계 및 구현",
        subItems: [
          "외부 서비스 연동: 투어 서비스 / 항공 서비스와 Kinesis 기반 이벤트 처리 (순서 보장, 대용량 스트리밍)",
          "패키지 도메인 내부: 검색 서비스 ↔ 상품 서비스 ↔ 예약 서비스 간 SQS 기반 이벤트 처리",
          "SQS/Kinesis 용도별 메시지 큐 선택 기준 정립 및 팀 내 공유",
        ],
      },
      { text: "Redis 캐싱 전략 수립 및 적용 (검색/카탈로그/PDP/SRP)" },
      {
        text: "동시성 제어 및 데이터 정합성 확보",
        subItems: [
          "예약 변경 시 동시성 문제 2주간 트랜잭션 로그 분석하여 근본 원인 파악",
          "낙관적 잠금(@Version) 적용으로 동시성 이슈 100% 해결",
          "재고 관리 3단계 검증 체계 구축 (예약 생성 → 결제 직전 재확인 → 결제 완료 후 차감)",
        ],
      },
      { text: "전시 채널 연동 (INT 채널)" },
      { text: "알림톡 발송 이력 관리 및 템플릿 enum 관리 체계 구축" },
      { text: "Admin 관리 화면 전체 개발 (React 기반 풀스택)" },
      { text: "C# 레거시 시스템을 Kotlin 기반 신규 시스템으로 재구축" },
      { text: "애자일(스크럼) 방식 적용 및 스프린트 기반 개발 프로세스 참여" },
      { text: "단위 테스트 200개 이상 작성, 커버리지 85% 유지" },
    ],
    achievement:
      "MSA 기반 패키지 플랫폼을 처음부터 설계하고 전체 개발을 주도했습니다. 투어 서비스의 투어상품/호텔상품과 항공 서비스의 항공상품을 연동하여 단일 상품이 아닌 결합형 패키지 상품 구조를 설계했으며, 외부 서비스와는 Kinesis 기반 이벤트 처리로 순서 보장 및 대용량 스트리밍을 확보하고, 패키지 도메인 내부는 SQS 기반 이벤트 처리로 서비스 간 느슨한 결합을 달성했습니다. 이벤트 수신 로직을 별도 서버로 분리하여 시스템 의존성을 감소시키고 유지보수성을 향상시켰습니다. 2주간 트랜잭션 로그를 집중 분석하여 동시성 문제의 근본 원인을 파악하고, 낙관적 잠금을 적용하여 예약 변경 시 동시성 이슈를 100% 해결했습니다. 재고 관리 3단계 검증 체계로 오버부킹을 원천 방지했으며, 취소 로직을 상품 타입별로 Service 클래스로 분리하고 Factory 패턴으로 리팩토링하여 코드 가독성과 유지보수성을 향상시켰습니다. 호텔 객실 기준인원과 각 아이템(투어, 호텔, 교통)의 최소 출발인원을 계산하는 출발확정 알고리즘을 개발하여 운영 자동화를 달성했습니다. C# 레거시 시스템을 Kotlin 기반 신규 시스템으로 재구축했으며, DDD 원칙을 적용하여 높은 응집도와 낮은 결합도를 달성했습니다. 단위 테스트 200개 이상 작성하여 커버리지 85%를 유지하며 코드 품질을 확보했고, 애자일(스크럼) 방식을 적용한 개발 프로세스에 참여했습니다.",
  },
  {
    title: "해외 숙소 플랫폼 운영 및 유지보수",
    subtitle:
      "익스피디아 Rapid API 버전 업그레이드로 인한 대규모 로직 개편을 무중단으로 완료하고, 보안 감사 대응 경험을 쌓았습니다.",
    period: "2022.04 - 2023.06",
    company: "인터파크트리플",
    works: [
      {
        text: "익스피디아 Rapid API 버전 업그레이드 대응 및 로직 개편",
        subItems: [
          "API 스펙 변경에 따른 예약/취소/조회 로직 전면 재구성",
          "하위 호환성 유지를 위한 어댑터 패턴 적용",
        ],
      },
      {
        text: "NOL 현대카드 PLCC 관련 해외숙소 플랫폼 PLCC 카드 혜택 결제 기능 지원",
      },
      {
        text: "페이스북 피드 프로시저 수정 (노출 금액 & 이미지 미노출 이슈 해결)",
      },
      { text: "마이페이지 & 예약메일 바우처/인보이스 시스템 개선" },
      { text: "ITGC 내부 감사 대응 (호텔인, 구하우징 2개 서비스)" },
    ],
    achievement:
      "익스피디아 Rapid API 버전 업그레이드로 인한 대규모 로직 개편을 성공적으로 완료하여, 기존 서비스 중단 없이 신규 API 스펙으로 안정적으로 전환했습니다. 어댑터 패턴을 적용하여 하위 호환성을 유지하면서도 확장 가능한 구조를 확보했습니다. ITGC 내부 감사에 완벽히 대응하여 보안 컴플라이언스 경험을 쌓았습니다.",
  },
  {
    title: "OCR 모듈 통합 관리 플랫폼",
    subtitle:
      "4개 DB 벤더를 지원하는 SQL 구문 분석기를 설계하고, Blazor를 활용한 실시간 서버 모니터링 대시보드를 구축했습니다.",
    period: "2020.11 - 2022.03",
    company: "미네르바소프트",
    works: [
      { text: "SQL 구문 분석기 전체 설계 및 개발 (4개 DB 벤더 지원)" },
      { text: "플랫폼 서비스와 Socket을 통한 양방향 네트워크 통신" },
      { text: "서버 모니터링 대시보드 전체 개발 (Blazor)" },
      { text: "서버 사이드 파일 탐색기 구현 (Linux 환경 지원)" },
    ],
    achievement:
      "플랫폼 코어 개발자와 협업하여 자체 통신 프로토콜 개발을 주도했고, ANSI SQL을 기반으로 Oracle, MSSQL, MySQL, PostgreSQL 4개 DB 벤더를 완벽히 지원하는 SQL 구문 분석기를 구현했습니다. Socket을 통한 플랫폼 서비스와의 고성능 양방향 통신을 구현했으며, Blazor를 활용한 실시간 서버 모니터링 대시보드를 설계하고 개발했습니다.",
  },
  {
    title: "마케팅 동의서 인식 API 모듈 개발",
    subtitle:
      "Manager-Agent 구조의 병렬 처리 시스템을 설계하여 대량의 동의서를 고성능으로 처리하는 시스템을 구축했습니다.",
    period: "2020.09 - 2020.11",
    company: "미네르바소프트",
    works: [
      { text: "Manager 개발 (Agent 관리 및 WebAPI 인터페이스 개발)" },
      { text: "Agent 개발 (유휴기간이 긴 Agent 우선 작업 할당, 동의서 인식)" },
      { text: "비동기 및 병렬 처리 아키텍처 설계 및 구현" },
    ],
    achievement:
      "멀티 프로세스 기반 작업 병렬 처리 및 비동기 처리 아키텍처를 구축했고, Manager와 Agent 간의 Socket 통신으로 작업 할당 및 결과 수신 시스템을 개발했습니다.",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="mb-4 cursor-pointer border-l-2 border-[#238636] bg-[#161b22] p-4 transition-all duration-200 hover:scale-[1.01] hover:border-[#2ea043] hover:bg-[#1c2128] hover:shadow-lg hover:shadow-[#238636]/20"
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-[#58a6ff]">
            {project.title}
          </h3>
          <p className="mb-2 text-sm italic text-[#8b949e]">
            {project.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-[#8b949e]">
            <span>📅 {project.period}</span>
            <span>🏢 {project.company}</span>
          </div>
        </div>
        <div className="ml-4 text-[#8b949e] transition-colors">
          {isExpanded ? "▼" : "▶"}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-4 border-t border-[#30363d] pt-4">
          {/* Main Work */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-[#7ee787]">
              주요 업무
            </h4>
            <ul className="space-y-2 text-sm text-[#c9d1d9]">
              {project.works.map((work, i) => (
                <li key={i}>
                  <div className="flex">
                    <span className="mr-2 text-[#8b949e]">•</span>
                    <div className="flex-1">
                      <span>{work.text}</span>
                      {work.subItems && (
                        <ul className="mt-1 space-y-1 pl-4">
                          {work.subItems.map((subItem, j) => (
                            <li key={j} className="flex text-[#8b949e]">
                              <span className="mr-2">-</span>
                              <span>{subItem}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievement */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-[#7ee787]">성과</h4>
            <p className="text-sm leading-relaxed text-[#c9d1d9]">
              {project.achievement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 경력 계산 함수
function calculateCareerDuration(startDate: string, endDate: string = "now") {
  const start = new Date(startDate);
  const end = endDate === "now" ? new Date() : new Date(endDate);

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  const totalMonths = years * 12 + months;
  const yearsPart = Math.floor(totalMonths / 12);
  const monthsPart = totalMonths % 12;

  return { years: yearsPart, months: monthsPart };
}

// 간트 차트용 회사 정보
const companies = [
  {
    name: "미네르바소프트",
    start: "2020-09-01",
    end: "2022-04-01",
    color: "#a8d5ba",
  },
  {
    name: "NOL Universe (인터파크트리플)",
    start: "2022-04-01",
    end: "now",
    color: "#90c9e8",
    note: "2024.12 법인명 변경",
  },
];

// 전체 기간 계산 (2020.09 ~ 현재)
const totalCareer = calculateCareerDuration("2020-09-01");
const careerText = `${totalCareer.years}년 ${totalCareer.months}개월`;

// 간트 차트 계산
const chartStart = new Date("2020-09-01");
const chartEnd = new Date();
const currentYear = chartEnd.getFullYear();
const currentMonth = (chartEnd.getMonth() + 1).toString().padStart(2, "0");
const totalMonths =
  (chartEnd.getFullYear() - chartStart.getFullYear()) * 12 +
  (chartEnd.getMonth() - chartStart.getMonth());

const companyBars = companies.map((company) => {
  const start = new Date(company.start);
  const end = company.end === "now" ? chartEnd : new Date(company.end);

  const startMonths =
    (start.getFullYear() - chartStart.getFullYear()) * 12 +
    (start.getMonth() - chartStart.getMonth());
  const endMonths =
    (end.getFullYear() - chartStart.getFullYear()) * 12 +
    (end.getMonth() - chartStart.getMonth());
  const durationMonths = endMonths - startMonths;

  return {
    ...company,
    left: (startMonths / totalMonths) * 100,
    width: (durationMonths / totalMonths) * 100,
    endMonths: endMonths,
  };
});

// 절취선 위치 계산 (정확한 날짜 기준)
const transition2022 =
  (((new Date("2022-04-01").getFullYear() - chartStart.getFullYear()) * 12 +
    (new Date("2022-04-01").getMonth() - chartStart.getMonth())) /
    totalMonths) *
  100;

const gridLines = [
  { position: 0, label: "2020.09" },
  { position: transition2022, label: "2022.04" },
  { position: 100, label: `${currentYear}.${currentMonth} (현재)` },
];

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="font-mono text-sm text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
          >
            ravit.run
          </Link>
          <StatusIndicator />
        </div>
      </nav>

      {/* Content with padding for fixed nav */}
      <div className="pt-[57px]">
        {/* Timeline - Gantt Chart */}
        <div className="border-b border-[#30363d] bg-[#0d1117]">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <h2 className="mb-4 text-xl font-semibold text-[#7ee787]">
              경력{" "}
              <span className="text-sm font-normal text-[#8b949e]">
                ({careerText})
              </span>
            </h2>

            {/* Gantt Chart Container */}
            <div className="rounded border border-[#30363d] bg-[#161b22] p-4">
              {/* Chart Area */}
              <div className="relative h-16">
                {/* Grid Lines */}
                {gridLines.map((line, index) => (
                  <div
                    key={index}
                    className="absolute top-0 h-full border-l border-dashed border-[#30363d]"
                    style={{ left: `${line.position}%` }}
                  />
                ))}

                {/* Company Bars */}
                {companyBars.map((bar, index) => (
                  <div
                    key={index}
                    className="group absolute top-4 h-10 rounded-sm"
                    style={{
                      left:
                        index === 0
                          ? `${bar.left}%`
                          : `calc(${bar.left}% + 1px)`,
                      width:
                        index === 0
                          ? `calc(${bar.width}% - 1px)`
                          : `${bar.width}%`,
                      backgroundColor: bar.color,
                    }}
                  >
                    <div className="flex h-full items-center justify-center px-2">
                      <span className="truncate text-xs font-semibold text-[#0d1117]">
                        {bar.name.split(" (")[0]}
                      </span>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="invisible absolute bottom-full left-0 z-10 mb-2 whitespace-nowrap rounded bg-[#21262d] px-3 py-2 text-xs text-[#c9d1d9] shadow-lg group-hover:visible">
                      <div className="font-semibold">{bar.name}</div>
                      <div className="text-[#8b949e]">
                        {bar.start.substring(0, 7)} ~{" "}
                        {bar.end === "now" ? "현재" : bar.end.substring(0, 7)}
                      </div>
                      {bar.note && (
                        <div className="mt-1 text-[#8b949e] italic">
                          {bar.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline axis */}
              <div className="relative mt-2 h-px bg-[#30363d]" />

              {/* Timeline labels */}
              <div className="relative h-6">
                {gridLines.map((line, index) => (
                  <div
                    key={index}
                    className="absolute top-1 text-xs text-[#8b949e]"
                    style={{
                      left: `${line.position}%`,
                      transform:
                        index === 0
                          ? "translateX(0%)"
                          : index === gridLines.length - 1
                            ? "translateX(-100%)"
                            : "translateX(-50%)",
                    }}
                  >
                    {line.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-[#7ee787]">
            프로젝트 경험
          </h2>
          <div className="space-y-0">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-[#30363d] bg-[#161b22] px-4 py-6 text-center text-sm text-[#8b949e]">
          <p>© 2026 RAVIT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
