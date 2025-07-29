export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: AddressDTO;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  address: AddressDTO;
}
