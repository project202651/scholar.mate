import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/app',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/signup',
        permanent: false,
      },
      {
        source: '/plans',
        destination: '/plan',
        permanent: false,
      },
      {
        source: '/study',
        destination: '/app',
        permanent: false,
      },
      {
        source: '/practice',
        destination: '/app?tab=practice',
        permanent: false,
      },
      {
        source: '/mock-exam',
        destination: '/app?tab=mock_exams',
        permanent: false,
      },
      {
        source: '/mock',
        destination: '/app?tab=mock_exams',
        permanent: false,
      },
      {
        source: '/flashcards',
        destination: '/app?tab=flashcards',
        permanent: false,
      },
      {
        source: '/focus',
        destination: '/app?tab=timer',
        permanent: false,
      },
      {
        source: '/timer',
        destination: '/app?tab=timer',
        permanent: false,
      },
      {
        source: '/nexa',
        destination: '/app?tab=nexa',
        permanent: false,
      },
      {
        source: '/predictor',
        destination: '/app?tab=predictor',
        permanent: false,
      },
      {
        source: '/dochub',
        destination: '/app?tab=dochub',
        permanent: false,
      },
      {
        source: '/documents',
        destination: '/app?tab=dochub',
        permanent: false,
      },
      {
        source: '/blueprint',
        destination: '/app?tab=exam_center',
        permanent: false,
      },
      {
        source: '/exam-center',
        destination: '/app?tab=exam_center',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
