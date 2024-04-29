import { HttpHeaders } from '@angular/common/http';

export const httpHeaders = () => {
  const token = localStorage.getItem('token');

  let headers: HttpHeaders | { [key: string]: string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token && token !== '') {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return headers;
};
