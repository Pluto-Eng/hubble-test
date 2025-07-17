export interface Config {
  env: string,
  aws: {
    region: string;
    s3: {
      bucket: string;
      region?: string;
    };
    cognito: {
      userPoolId?: string;
      userPoolClientId?: string;
      region?: string;
    };
    fargate: {
      endpoint: string;
      timeout: number;
      retries: number;
    };
  };
  api: {
    baseUrl?: string;
    timeout: number;
    retries: number;
  };
  services: {
    openai: {
      apiKey?: string;
      model: string;
    };
    signwell: {
      apiUrl: string;
      apiKey?: string;
      appId?: string;
      signerEmail: string;
      templates: {
        loanAgreementId?: string;
        pledgeAgreementId?: string;
        fundConsentId?: string;
      };
    };
  };
  app: {
    name: string;
    origin: string;
    port: number;
    cookies: {
      domain?: string;
      secure: boolean;
      sameSite: 'strict';
    };
  };
  // emails: {
  //   support?: string;
  //   documents?: string;
  //   noreply?: string;
  //   test: {
  //     default: string;
  //     borrower: string;
  //     fund: string;
  //   };
  // };
  enable: {
    analytics: boolean;
    logging: boolean;
    testMode: boolean;
  };
}

const getEnvironment = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    } else if (process.env.NODE_ENV === 'production') {
      return 'production';
    } else if (process.env.NODE_ENV === 'test') {
      return 'staging';
    }
    return 'development';
};

const isDevelopment = getEnvironment() === 'development';
const isProduction = getEnvironment() === 'production';

export const config: Config = {
  env: getEnvironment(),
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    s3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'weloc-documents-v2',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
    },
    fargate: {
      endpoint: process.env.NEXT_PUBLIC_FARGATE_ENDPOINT || 'http://localhost:3000/api',
      timeout: parseInt(process.env.API_TIMEOUT || '30000'),
      retries: 3,
    },
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
    retries: 3,
  },

  services: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    },
    signwell: {
      apiUrl: 'https://www.signwell.com/api/v1',
      apiKey: process.env.SIGNWELL_API_KEY,
      appId: process.env.SIGNWELL_APP_ID,
      signerEmail: process.env.SIGNWELL_SIGNER_EMAIL || 'bryan@plutocredit.com',
      templates: {
        loanAgreementId: process.env.NEXT_PUBLIC_SIGNWELL_LOAN_AGREEMENT_TEMPLATE_ID,
        pledgeAgreementId: process.env.NEXT_PUBLIC_SIGNWELL_PLEDGE_AGREEMENT_TEMPLATE_ID,
        fundConsentId: process.env.NEXT_PUBLIC_SIGNWELL_FUND_CONSENT_TEMPLATE_ID,
      },
    },
  },

  app: {
    name: 'Pluto Credit',
    origin: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
    port: parseInt(process.env.NEXT_PUBLIC_APP_PORT || '3001'),
    cookies: {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      secure: isProduction,
      sameSite: 'strict' as const,
    },
  },

//   emails: {
//     support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
//     documents: process.env.NEXT_PUBLIC_DOCUMENTS_EMAIL,
//     noreply: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
//     test: {
//       default: isDevelopment ? 'bryan+a3@plutocredit.com' : '',
//       borrower: isDevelopment ? 'borrower-test@plutocredit.com' : '',
//       fund: isDevelopment ? 'fund-test@plutocredit.com' : '',
//     },
//   },

  enable: {
    analytics: process.env.ENABLE_ANALYTICS === 'true' || isProduction,
    logging: process.env.ENABLE_LOGGING === 'true' || isDevelopment,
    testMode: process.env.ENABLE_TEST_MODE === 'true' || !isProduction,
  } as const,
};

export const { env, aws, api, services, app, enable } = config;