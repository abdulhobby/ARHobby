class TrackingService {
  getIndiaPostTrackingUrl(trackingNumber) {
    return `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx`;
  }

  getTrackingInfo(trackingNumber) {
    if (!trackingNumber) return null;

    return {
      trackingNumber,
      carrier: 'India Post',
      trackingUrl: this.getIndiaPostTrackingUrl(trackingNumber),
      message: 'Please visit India Post website and enter your tracking number to track your shipment.'
    };
  }
}

export default new TrackingService();