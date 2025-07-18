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
      baseUrl: string;
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
      sessionMaxAge: number;
      cookies: {
        sessionToken: {
          name: string;
          options: {
            domain?: string;
            secure: boolean;
            sameSite: 'strict' | 'lax' | 'none';
            httpOnly: boolean;
            path: string;
            maxAge: number;
          }
        }
        callbackUrl: {
          name: string;
          options: {
            sameSite: 'strict' | 'lax' | 'none';
            path: string;
            secure: boolean;
          }
        },
        csrfToken: {
          name: string;
          options: {
            httpOnly: boolean;
            sameSite: 'strict' | 'lax' | 'none';
            path: string;
            secure: boolean;
          }
        }
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
  
  const isDev = getEnvironment() === 'development';
  const isProd = getEnvironment() === 'production';
  
  export const config: Config = {
    env: getEnvironment(),
    aws: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      s3: {
        bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'weloc-documents-v2',
        region: process.env.NEXT_PUBLIC_AWS_REGION,
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
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
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
      sessionMaxAge: 15 * 60, // 15 minutes
      cookies: {
        sessionToken: {
          name: isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
          options: {
            domain: process.env.AUTH_DOMAIN || undefined,
            httpOnly: true,
            sameSite: 'strict', // CSRF protection
            path: '/',
            secure: isProd, // HTTPS only in production
            maxAge: 15 * 60, // 15 minutes
          }
        },
        callbackUrl: {
          name: isProd ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
          options: {
            sameSite: 'strict',
            path: '/',
            secure: isProd,
          },
        },
        csrfToken: {
          name: isProd ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
          options: {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            secure: isProd,
          },
        },
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
      analytics: process.env.ENABLE_ANALYTICS === 'true' || isProd,
      logging: process.env.ENABLE_LOGGING === 'true' || isDev,
      testMode: process.env.ENABLE_TEST_MODE === 'true' || !isProd,
    } as const,
  };
  
  export const { env, aws, api, services, app, enable } = config;