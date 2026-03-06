/**
 * NotaryLink API — generated from infra/openapi.yaml
 * Run `npm run generate:api` to refresh after editing the spec.
 */

export interface paths {
  "/api/auth/register": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never };
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["RegisterRequest"];
        };
      };
      responses: {
        201: {
          content: {
            "application/json": components["schemas"]["AuthResponse"];
          };
        };
        400: {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/login": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never };
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["LoginRequest"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["AuthResponse"];
          };
        };
        401: {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    RegisterRequest: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    AuthResponse: {
      accessToken: string;
      tokenType: string;
    };
    ErrorResponse: {
      error?: string;
      message?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;
export type webhooks = Record<string, never>;
