import Address from '../models/Address.js';

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault, label } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const addressCount = await Address.countDocuments({ user: req.user._id });
    const address = await Address.create({
      user: req.user._id,
      fullName, phone, addressLine1, addressLine2, city, state, pincode,
      country: country || 'India',
      isDefault: isDefault || addressCount === 0,
      label: label || 'Home'
    });

    res.status(201).json({ success: true, address, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault, label } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: address._id } }, { isDefault: false });
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;
    if (label) address.label = label;

    await address.save();
    res.status(200).json({ success: true, address, message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(req.params.id);

    if (wasDefault) {
      const firstAddress = await Address.findOne({ user: req.user._id });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
      }
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDefault: true });

    res.status(200).json({ success: true, message: 'Default address updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};