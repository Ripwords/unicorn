import configureMeasurements, {
  AllMeasures,
  allMeasures,
  AllMeasuresSystems,
  AllMeasuresUnits
} from "convert-units";

const convert = configureMeasurements<
  AllMeasures,
  AllMeasuresSystems,
  AllMeasuresUnits
>(allMeasures)

export const categories = convert().measures()

export default convert