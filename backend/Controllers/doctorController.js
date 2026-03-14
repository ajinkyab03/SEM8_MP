import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

// Update Doctor
export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating Doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deletedDoctor,
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
      error: error.message,
    });
  }
};

// Get Single Doctor
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Found",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching single doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find doctor",
      error: error.message,
    });
  }
};

// Get All Approved Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctorsQuery = { isApproved: "approved" };

    if (query) {
      doctorsQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(doctorsQuery).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "No doctors found",
      error: error.message,
    });
  }
};

// Get Doctor Profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const appointments = await Booking.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "Profile info retrieved",
      data: { ...doctor._doc, appointments },
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get profile",
      error: error.message,
    });
  }
};
