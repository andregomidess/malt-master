export const BREWING_CONSTANTS = {
  /**
   * Default mashing efficiency (70%)
   */
  DEFAULT_EFFICIENCY: 70,

  /**
   * Default recipe volume in liters
   */
  DEFAULT_VOLUME: 20,

  /**
   * Default yield: 37 PPG (Points Per Pound per Gallon)
   * Based on average Pilsen/Pale Ale malt
   * Note: Stored in PPG for compatibility with existing database
   */
  DEFAULT_YIELD: 37,

  /**
   * Conversion factor from PPG (lb/gal) to metric system (kg/L)
   * 1 lb/gal = 8.345404 kg/L
   * Used to convert yield from PPG to gravity points in kg/L
   */
  PPG_TO_METRIC_CONVERSION: 8.345404,

  /**
   * Divisor for converting gravity points to specific gravity
   */
  GRAVITY_POINTS_DIVISOR: 1000,

  /**
   * Specific gravity base (pure water = 1.000)
   */
  SPECIFIC_GRAVITY_BASE: 1,

  /**
   * Typical attenuation percentage (75%)
   * Represents how much sugar the yeast consumes
   */
  TYPICAL_ATTENUATION_PERCENTAGE: 0.75,

  /**
   * Post-boil hop utilization (5%)
   * For whirlpool and dry hopping
   */
  POST_BOIL_HOP_UTILIZATION: 0.05,

  /**
   * Conversion factor from grams of alpha acids to milligrams (mg/L = IBU)
   * 1 IBU = 1 mg of isomerized alpha acids per liter
   */
  IBU_METRIC_CONVERSION_FACTOR: 1000,

  /**
   * Default alpha acids (%) if not specified
   * Based on typical bittering hops (6%)
   */
  DEFAULT_ALPHA_ACIDS: 6.0,

  /**
   * Tinseth formula constants for utilization calculation
   * Reference: Glenn Tinseth (1997)
   */
  TINSETH: {
    /**
     * Gravity adjustment coefficient
     * Used in: 1.65 × 0.000125^(OG - 1)
     */
    GRAVITY_COEFFICIENT: 1.65,
    GRAVITY_BASE: 0.000125,

    /**
     * Time coefficient (exponential decay factor)
     * Used in: (1 - e^(-0.04 × time)) / 4.15
     */
    TIME_COEFFICIENT: 0.04,
    TIME_DIVISOR: 4.15,
  },

  /**
   * Default color in Lovibond (light Pilsen malt)
   */
  DEFAULT_COLOR_LOVIBOND: 2,

  /**
   * Unit conversions for color calculation (MCU → SRM)
   * MCU is defined in imperial units
   */
  COLOR_CONVERSIONS: {
    /**
     * Conversion from kg to pounds
     * 1 kg = 2.20462 lbs
     */
    KG_TO_LBS: 2.20462,

    /**
     * Conversion from liters to gallons (US)
     * 1 L = 0.264172 gal
     */
    LITERS_TO_GALLONS: 0.264172,
  },

  /**
   * Morey formula constants for MCU → SRM conversion
   * Reference: Randy Morey (1995)
   * SRM = 1.4922 × (MCU^0.6859)
   */
  MOREY: {
    /**
     * Multiplier coefficient
     */
    COEFFICIENT: 1.4922,

    /**
     * Exponent (corrects non-linearity of color perception)
     */
    EXPONENT: 0.6859,
  },

  /**
   * ABV conversion factor
   * Formula: (OG - FG) × 131.25
   */
  ABV_CONVERSION_FACTOR: 131.25,
} as const;
