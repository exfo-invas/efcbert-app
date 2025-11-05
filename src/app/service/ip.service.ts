import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface IP {
  ipv4: string;
  ipv6: string[];
}

@Injectable({ providedIn: 'root' })
export class IpService {

  ipData: IP = {
    ipv4: '',
    ipv6: []
  };

  constructor(private apiService: ApiService) {
  }

  /**
   * Fetches the IP addresses from the API and stores them in the ipData property.
   * This method can be called to refresh the IP data whenever needed.
   */
  getIPs() {
    console.log("IpService: Recevied IP LIST request, Sending API call")
    this.apiService.getIPs().subscribe({
      next: (data: any) => {
        console.log('Fetched IPs:', data);
        // Assuming you want to store ipv4 and ipv6 in component properties
        // Add these properties to your class if not already present:
        // ipv4: string;
        // ipv6: string[];
        this.ipData = {
          ipv4: data.ipv4 || '',
          ipv6: data.ipv6 || []
        }
      },
      error: (error) => {
        console.error('Error fetching IPs:', error);
      }
    });
  }

  /**
   * Returns the stored IPv4 address.
   * @returns {string} The IPv4 address.
   */
  getIPv4(): string {
    console.log("IPV4", this.ipData.ipv4);
    return this.ipData.ipv4;
  }

  /**
   * Returns the stored IPv6 addresses.
   * @returns {string[]} The array of IPv6 addresses.
   */
  getIPv6(): string[] {
    return this.ipData.ipv6;
  }

}
