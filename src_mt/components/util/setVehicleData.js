
const setVehicleData = (detailResponse, setDriverDetails) => {
    let resultVehicles = {};
    detailResponse.vehicles.map((vehicle) => {
        resultVehicles[`${vehicle.vehicle_id}`] = vehicle
    });
    detailResponse.vehicles = resultVehicles;

    setDriverDetails(detailResponse);
    return detailResponse
};


export default setVehicleData;