export function getFormatContactState (originContactState){
  let contactState = '';
  if (originContactState === 'SUCCEED') {
    contactState = 'DLV';
  } else if(originContactState === 'FAILED') {
    contactState = 'FAIL';
  } else if(originContactState === 'PENDING') {
    contactState = 'PENDING';
  }
  return contactState;
}