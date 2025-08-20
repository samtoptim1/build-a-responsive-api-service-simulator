interface HttpResponse {
  statusCode: number;
  body: string;
}

interface RequestParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  queryParams: { [key: string]: string };
  body: any;
}

interface RequestOptions {
  delay: number;
  successProbability: number;
}

class ApiSimulator {
  private responses: { [key: string]: HttpResponse } = {};
  private requestOptions: RequestOptions = {
    delay: 1000,
    successProbability: 0.8,
  };

  addResponse(path: string, response: HttpResponse) {
    this.responses[path] = response;
  }

  async handleRequest(params: RequestParams): Promise<HttpResponse> {
    const { method, path, queryParams, body } = params;
    const response = this.responses[path];

    if (!response) {
      return {
        statusCode: 404,
        body: 'Not Found',
      };
    }

    if (Math.random() > this.requestOptions.successProbability) {
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }

    await new Promise((resolve) => setTimeout(resolve, this.requestOptions.delay));

    return response;
  }
}

const apiSimulator = new ApiSimulator();

apiSimulator.addResponse('/users', {
  statusCode: 200,
  body: '[{"id": 1, "name": "John Doe"}]',
});

apiSimulator.addResponse('/users/1', {
  statusCode: 200,
  body: '{"id": 1, "name": "John Doe"}',
});

apiSimulator.addResponse('/users/2', {
  statusCode: 404,
  body: 'Not Found',
});

export { ApiSimulator, HttpResponse, RequestParams, RequestOptions };