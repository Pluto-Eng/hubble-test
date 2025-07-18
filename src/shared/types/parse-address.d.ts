declare module 'parse-address' {
    interface ParsedAddress {
      number?: string;
      prefix?: string;
      street?: string;
      type?: string;
      sec_unit_type?: string;
      sec_unit_num?: string;
      city?: string;
      state?: string;
      zip?: string;
    }
  
    function parseLocation(address: string): ParsedAddress;
    
    export = {
      parseLocation
    };
  } 