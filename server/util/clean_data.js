/*jslint node: true */
'use strict';

/*  This file used to conform data received from the client to a standard format to satisfy
    queries to the database.
*/


var errorMaker = function( functionName, functionCode ) {
  /*  Common error codes:
  //    000: no data
  //    001: invalid format  */
  return function( code, message ) {
    return {
      errCode     : '' + functionCode + ':' + code,
      description : message,
      errLocation : functionName
    };
  };
};


module.exports.name = function( name ) {
  /*  This function takes a string and verifies that it contains no digits or illegal punctuation.
  //  If it meets these prerequisites, all letters are converted to lowercase and the name is
  //  returned.
  //  Error codes with this function start with '10:xxx'  */
  var currentChar = '';
  var itr         = 0;
  var error       = errorMaker( 'clean_data.name', '10' );
  
  if ( name === undefined ) { return error( '000', 'NO DATA: No name data found' ); }
  if ( typeof name !== 'string' ) { return error( '001', 'INVALID FORMAT: Name not supplied as a string' ); }
  if ( name === '' ) { return error( '002', 'NO DATA: Name supplied is an empty string.' ); }
  
  var isValid = function( character ) {
    if (  (character >= 'a' && character <= 'z')
       || (character >= 'A' && character <= 'Z')
       || character === '-'
       || character === ' '
       ) {
      return true;
    } else {
      return false;
    }
  };
  
  for ( itr = 0; itr < name.length; itr++ ) {
    currentChar = name.charAt( itr );
    if ( !(isValid( currentChar )) ) {
      return error( '201', 'INVALID ENTRY: Name contains illegal characters' );
    }
  }
  
  return name.toLowerCase();
};  //  End name()


module.exports.gender = function( sex ) {
  /*  This function takes a string as an argument and expects it to equal either 'male' or 'female'.
  //  Error codes for this function start with '11:xxx'  */
  var error = errorMaker( 'clean_data.gender', '11' );
  
  if ( sex === undefined ) { return error( '000', 'NO DATA: No gender data found' ); }
  if ( typeof sex !== 'string' ) { return error( '001', 'INVALID FORMAT: Gender not supplied as a string' ); }
  sex = sex.toLowerCase();
  
  if ( sex === 'male' || sex === 'female' ) {
    return sex;
  } else {
    return error( '101', 'INVALID ENTRY: Gender supplied is not "male" or "female"' );
  }
};  //  End gender()


module.exports.date = function( date ) {
  /*  This function verifies a valid date and formats it correctly for the database.
  //  It accepts either a string (formatted as 'yyyy-mm-dd'), a number (yyyymmdd), or
  //  a date object. The format is then forced into a MySQL DATE type format ('yyyy-mm-dd').
  //  Error codes with this function start with '12:xxx'  */
  var error       = errorMaker( 'clean_data.date', '12' );
  var eCodePrefix = '';
  var dateToday   = new Date();
  var itr         = 0;
  var currentChar = '';
  var result      = '';
  var resultYear  = null;
  var resultMonth = null;
  var resultDay   = null;
  
  var isValidYear   = function( year ) {
    return ( (year < 1900) || (year > dateToday.getFullYear()) ) ? false : true;
  };
  
  var isValidMonth  = function( month, year ) {
    if ( year && (year === dateToday.getFullYear()) ) {
      return ( (month < 1) || (month > (dateToday.getMonth() + 1)) ) ? false : true;
    } else {
      return ( (month < 1) || (month > 12) ) ? false : true;
    }
  };
  
  var isValidDay    = function( day, month, year ) {
    var maxDay = 31;
    if ( year && (year === dateToday.getFullYear()) && month && (month === (dateToday.getMonth() + 1)) ) {
      maxDay = dateToday.getDate();
    } else {
      switch( month ) {
        case 4:
        case 6:
        case 9:
        case 11:
          maxDay = 30;
          break;
        case 2:
          if ( (resultYear % 400 === 0) || ((resultYear % 4 === 0) && (resultYear % 100 !== 0)) ) {
            maxDay = 29;
          } else {
            maxDay = 28;
          }
          break;
        default:
      }
    }
    return ( (day < 1) || (day > maxDay) ) ? false : true;
  };
  
  if ( !date ) {
    return error( '000', 'NO DATA: No date data found' );
  }
  
  if ( typeof date === 'string' ) {
    
    eCodePrefix = '1'
    if ( date.length < 8 ) {
      return error( '101', 'INVALID FORMAT: Date string too short. Supply as "yyyy-mm-dd".' );
    } else if ( date.length > 10 ) {
      return error( '102', 'INVALID FORMAT: Date string too long. Supply as "yyyy-mm-dd".' );
    } else {
      for ( itr = 0; itr < date.length; itr++ ) {
        currentChar = date.charAt( itr );
        if ( result.length === 4 || result.length === 7 ) {
          result += '-';
          if ( currentChar >= '0' && currentChar <= '9' ) {
            result += currentChar;
          }
        } else {
          if ( result.length === 10 ) {
            return error( '103', 'INVALID ENTRY: Date data contains too many digits. Cannot parse correctly.' );
          }
          if ( currentChar >= '0' && currentChar <= '9' ) {
            result += currentChar;
          } else {
            return error( '104', 'INVALID ENTRY: Date data contains illegal characters.' );
          }
        }
      }
    }
    
  } else if ( typeof date === 'number' ) {
    
    eCodePrefix = '2';
    if ( date < 0 ) {
      return error( '201', 'INVALID FORMAT: Date number cannot be negative.' );
    } else if ( date < 10000000 ) {
      return error( '202', 'INVALID FORMAT: Date number too short. Should be 8 digits: yyyymmdd.' );
    } else if ( date > 99999999 ) {
      return error( '203', 'INVALID FORMAT: Date number too long. Should be 8 digits: yyyymmdd.' );
    }
    
    result = '' + date;
    result = result.slice( 0, 4 ) + '-' + result.slice( 4, 6 ) + '-' + result.slice( 6 );
    
  } else if ( typeof date === 'object' ) {
    
    eCodePrefix = '3';
    if ( (!date.getFullYear) || (!date.getMonth) || (!date.getDate) ) {
      return error( '300', 'INVALID FORMAT: Date data provided is not a Javascript Date object.' );
    }
    
    result = '' + date.getFullYear() + '-';
    if ( date.getMonth() < 9 ) { result += '0'; }
    result += (date.getMonth() + 1) + '-';
    if ( date.getDate() < 10 ) { result += '0'; }
    result += date.getDate();
    
  } else {
    return error( '001', 'INVALID FORMAT: Date supplied is an unexpected data type. Use a string, number, or Date object.' );
  }
  
  if ( result.length !== 10 ) { return error( '100', 'UNKNOWN ERROR: Date string parsed incorrectly.' ); }
  
  resultYear  = +(result.slice( 0, 4 ));
  resultMonth = +(result.slice( 5, 7 ));
  resultDay   = +(result.slice( 8 ));
  
  if ( isValidYear( resultYear ) ) {
    if ( isValidMonth( resultMonth, resultYear ) ) {
      if ( isValidDay( resultDay, resultMonth, resultYear ) ) {
        return result
      } else {
        return error( eCodePrefix + '07', 'INVALID DATA: Date contains an invalid day.' );
      }
    } else {
      return error( eCodePrefix + '06', 'INVALID DATA: Date contains an invalid month.' );
    }
  } else {
    return error( eCodePrefix + '05', 'INVALID DATA: Date contains an invalid year (must be between 1900 and current year).' );
  }
};


module.exports.age = function( age ) {
  /*  Just verifies that an age value is a number and within expected bounds.
  //  Error codes with this function start with '13:xxx'  */
  var error = errorMaker( 'clean_data.age', '13' );
  if ( age !== 0 && !age ) { return error( '000', 'NO DATA: Age data not found.' ); }
  if ( typeof age !== 'number' ) { return error( '001', 'INVALID FORMAT: Age supplied is not a number.' ); }
  
  if ( (!(isNaN( age ))) && (age < 0 || age > 120) ) {
    return error( '101', 'INVALID AGE: Age is not between 0 and 120.' );
  } else {
    return age;
  }
};


module.exports.phoneNumber = function( number ) {
  /*  This function takes a string representing a phone number. It will strip any preceding
  //  regional numbers (such as the preceding 1), resulting in only the 10 digit string starting
  //  with the area code. As such, this database cannot accept international numbers.
  //  Error codes with this function start with '14:xxx'.  */
  var digit   = '';
  var result  = '';
  var itr     = 0;
  var error   = errorMaker( 'clean_data.phoneNumber', '14' );
  
  if ( number === undefined ) {
    return error( '000', 'NO DATA: No phone number data found' );
  } else if ( typeof number !== 'string' ) {
    if ( typeof number === 'number' ) {
      number = number.toString();
    } else {
      return error( '001', 'INVALID FORMAT: Phone number not supplied as string or number' );
    }
  }
  
  for ( itr = 0; itr < number.length; itr++ ) {
    digit = number.charAt( itr );
    
    if ( digit >= '0' && digit <= '9' ) {
      result += digit;
    } else if ( (digit >= 'a' && digit <= 'z') || (digit >= 'A' && digit <= 'Z') ) {
      return error( '101', 'INVALID FORMAT: Phone number contains invalid characters' );
    }
  }
  
  if ( result.length > 10 ) {
    result = result.slice( (result.length - 10) );
  } else if ( result.length < 10 ) {
    return error( '102', 'INVALID FORMAT: Phone number does not contain an area code' );
  }
  
  return +result;
};  //  END phoneNumber()


module.exports.email = function( address ) {
  /*  This function checks that the string supplied as an argument is a valid email address. If it
  //  is, it converts all letters to lowercase.
  //  Error codes with this function start with '15:xxx'  */
  var itr             = 0;
  var atFound         = false;
  var endPeriodFound  = false;
  var currentChar     = '';
  var error           = errorMaker( 'clean_data.email', '15' );
  
  if ( address === undefined ) { return error( '000', 'NO DATA: No email data found' ); }
  if ( typeof address !== 'string' ) { return error( '001', 'INVALID FORMAT: Email not supplied as a string' ); }
  
  var isValid = function( character ){
    if (  (character >= 'a' && character <= 'z')
       || (character >= 'A' && character <= 'Z')
       || (character >= '0' && character <= '9')
       || character === '.'
       || character === '-'
       || character === '_'
       || character === '+'
       || character === '@'
       ) {
      return true;
    } else {
      return false;
    }
  };
  
  for ( itr = 0; itr < address.length; itr++ ) {
    currentChar = address.charAt( itr );
    if ( !(isValid( currentChar )) ) {
      return error( '101', 'INVALID FORMAT: Email contains invalid characters' );
    } else {
      if ( !atFound ) {
        if ( currentChar === '@' ) {
          if ( itr > 0 ) {
            atFound = itr;
          } else {
            return error( '201', 'INVALID ADDRESS: Email contains no local identifier; no data found before "@" character' );
          }
        }
      } else {
        if ( currentChar === '@' ) {
          return error( '202', 'INVALID ADDRESS: Email contains more than one "@" character' );
        }
        
        if ( !endPeriodFound ) {
          if ( currentChar === '.' ) {
            if ( itr === (atFound + 1) ) {
              return error( '302', 'INVALID DOMAIN: Email domain starts with a period.' );
            } else if ( itr >= (address.length - 1) ) {
              return error( '301', 'INVALID DOMAIN: Email ends with a period' );
            } else {
              endPeriodFound = true;
            }
          }
        } else {
          if ( itr >= (address.length - 1) && currentChar === '.' ) {
            return error( '301', 'INVALID DOMAIN: Email ends with a period' );
          }
        }
      }
    }
  }
  
  if ( atFound && endPeriodFound ) {
    //  the address is valid; convert it to lowercase and return it
    return address.toLowerCase();
  } else {
    if ( !atFound ) {
      return error( '200', 'INVALID ADDRESS: Email contains no "@" character' );
    } else if ( !endPeriodFound ) {
      return error( '300', 'INVALID DOMAIN: Email contains no period following the "@" character' );
    } else {
      return error( '-00', 'UNKNOWN ERROR: Invalid email' );
    }
  }
};  //  End email()


module.exports.address = function( addr1, addr2, city, state, zip ) {
  /*  Takes an entire address and formats it correctly. Expects all but addr2 to have a
  //  value, and will return an error if any entry other than addr2 is undefined or null.
  //  Error codes with this function start with '16:xxx'  */
  var error       = errorMaker( 'clean_data.address', '16' );
  var itr         = 0;
  var hasNumAddr  = false;
  var hasStName   = false;
  var currentChar = '';
  var result      = {
    'address1': null,
    'address2': null,
    'city'    : null,
    'state'   : null,
    'zip'     : null
  };
  
  if ( (!addr1) || (!city) || (!state) || (!zip) ) {
    return error( '000', 'NO DATA: Mailing address is missing address line 1, city, state, or zip code.' );
  }
  if ( typeof addr1 !== 'string' ) {
    return error( '001', 'INVALID INPUT: Address line 1 is not a string.' );
  } else if ( addr2 && (typeof addr2 !== 'string') ) {
    return error( '002', 'INVALID INPUT: Address line 2 is not a string.' );
  } else if ( typeof city !== 'string' ) {
    return error( '003', 'INVALID INPUT: City is not a string.' );
  } else if ( typeof state !== 'string' ) {
    return error( '004', 'INVALID INPUT: State is not a string.' );
  } else if ( typeof zip !== 'number' ) {
    if ( (typeof zip !== 'string') || isNaN(+(zip.slice( 0, 5 ))) ) {
      return error( '005', 'INVALID INPUT: Zip code is not a number.' );
    }
  }
  
  result.address1 = addr1.toLowerCase();
  if ( addr2 ) { result.address2 = addr2.toLowerCase(); }
  result.city = city.toLowerCase();
  result.state = state.toLowerCase();
  result.zip = (typeof zip === 'string') ? +(zip.slice( 0, 5 )) : zip;
  
  if ( (zip < 0) || (zip > 99999) ) {
    return error( '501', 'INVALID ENTRY: Zip code is not a valid number.' );
  }
  
  return result;
};


module.exports.location = function( name ) {
  /*  Just returns the location in lowercase format.
  //  Error codes with this function start with '17:xxx'  */
  var error = errorMaker( 'clean_data.location', '17' );
  if ( !name ) {
    return error( '000', 'NO DATA: No location data found.' );
  }
  if ( typeof name !== 'string' ) {
    return error( '001', 'INVALID FORMAT: Location data is not a string.' );
  }
  if ( name === '' ) {
    return error( '100', 'NO DATA: Location not found; empty string received.' );
  }
  
  return name.toLowerCase();
};


module.exports.programArea = function( name ) {
  /*  Just returns the location in lowercase format.
  //  Error codes with this function start with '18:xxx'  */
  var error = errorMaker( 'clean_data.programArea', '18' );
  if ( !name ) {
    return error( '000', 'NO DATA: No program data found.' );
  }
  if ( typeof name !== 'string' ) {
    return error( '001', 'INVALID FORMAT: Program data is not a string.' );
  }
  if ( name === '' ) {
    return error( '100', 'NO DATA: Program not found; empty string received.' );
  }
  
  return name.toLowerCase();
};


module.exports.itemName = function( name ) {
  /*  Just returns the location in lowercase format.
  //  Error codes with this function start with '19:xxx'  */
  var error = errorMaker( 'clean_data.itemName', '19' );
  if ( !name ) {
    return error( '000', 'NO DATA: No item name data found.' );
  }
  if ( typeof name !== 'string' ) {
    return error( '001', 'INVALID FORMAT: Item name data is not a string.' );
  }
  if ( name === '' ) {
    return error( '100', 'NO DATA: Item name not found; empty string received.' );
  }
  
  return name.toLowerCase();
};


module.exports.itemPrice = function( price ) {
  /*
  //  Error codes with this function start with '20:xxx'  */
  var error   = errorMaker( 'clean_data.itemPrice', '20' );
  var itr     = null;
  var result  = null;
  
  if ( !price ) {
    return error( '000', 'NO DATA: No item price data found.' );
  }
  if ( typeof price !== 'number' ) {
    return error( '001', 'INVALID FORMAT: Item price data is not a number.' );
  }
  if ( price < 0.00 ) {
    return error( '101', 'INVALID ENTRY: Item price cannot be negative.' );
  }
  
  result = ('' + price);
  itr = result.indexOf( '.' );
  if ( itr === -1 ) {
    result += '.00';
  } else {
    result = result.slice( 0, (itr + 3) );
    while ( (result.length - itr - 1) < 2 ) {
      result += '0';
    }
  }
  
  return +result;
};


module.exports.department = function( dept ) {
  /*  Just returns the location in lowercase format.
  //  Error codes with this function start with '21:xxx'  */
  var error = errorMaker( 'clean_data.department', '21' );
  if ( !dept ) {
    return error( '000', 'NO DATA: No department data found.' );
  }
  if ( typeof dept !== 'string' ) {
    return error( '001', 'INVALID FORMAT: Department data is not a string.' );
  }
  if ( dept === '' ) {
    return error( '100', 'NO DATA: Department not found; empty string received.' );
  }
  
  return dept.toLowerCase();
};





























