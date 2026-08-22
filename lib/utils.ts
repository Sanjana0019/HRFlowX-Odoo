import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DynamicSalaryStructure } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (currency === "INR" || currency === "₹") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeString?: string): string {
  if (!timeString) return "--:--";
  return timeString;
}

// Generate Employee ID by format: [Company2Letters][Name2Letters][Year][4DigitSeq]
// Example: "HRFlowX" + "Alex Rivera" + 2023 + 1 -> "HXAR20230001"
export function generateEmployeeId(
  companyName: string,
  employeeName: string,
  joiningYear: number | string = new Date().getFullYear(),
  sequenceNum: number = 1
): string {
  // Company Code:
  // If multi-word (e.g. "Odoo India"), use initials of first 2 words -> "OI"
  // If single word starting with "HRFlow", use "HX"
  // Otherwise first 2 uppercase letters
  const compWords = companyName.trim().split(/\s+/).filter(Boolean);
  let compCode = "";
  if (companyName.toUpperCase().includes("HRFLOW")) {
    compCode = "HX";
  } else if (compWords.length >= 2) {
    compCode = (compWords[0][0] + compWords[1][0]).toUpperCase();
  } else {
    const cleanComp = companyName.replace(/[^a-zA-Z]/g, "").toUpperCase();
    compCode = cleanComp.length >= 2 ? cleanComp.substring(0, 2) : "HX";
  }

  // Name Code:
  // First letter of first name + first letter of last name (e.g. "Alex Rivera" -> "AR", "John Doe" -> "JD" or "JO")
  const nameParts = employeeName.trim().split(/\s+/).filter(Boolean);
  let nameCode = "";
  if (nameParts.length >= 2) {
    nameCode = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  } else if (nameParts.length === 1) {
    nameCode = nameParts[0].substring(0, 2).toUpperCase();
  }
  if (nameCode.length < 2) nameCode = "EM";

  const yearStr = String(joiningYear);
  const seqStr = String(sequenceNum).padStart(4, "0");

  return `${compCode}${nameCode}${yearStr}${seqStr}`;
}

// Compute dynamic salary components according to required percentage formulas
export function calculateDynamicSalaryStructure(
  monthlyWage: number,
  workingDaysPerWeek: number = 5,
  workingHoursPerWeek: number = 40,
  breakTimeMinutes: number = 60
): DynamicSalaryStructure {
  const wage = Math.max(0, monthlyWage);
  const yearlyWage = wage * 12;

  // Basic = 50% of Wage
  const basicPercentage = 50.0;
  const basicSalary = Math.round(wage * 0.5);

  // HRA = 50% of Basic
  const hraPercentageOfBasic = 50.0;
  const houseRentAllowance = Math.round(basicSalary * 0.5);

  // Standard Allowance = 8.334% of Wage (or ~4167 on 50k)
  const standardAllowance = Math.round(wage * 0.08334);

  // Performance Bonus = 8.33% of Basic
  const performanceBonusPercentage = 8.33;
  const performanceBonus = Math.round(basicSalary * 0.0833);

  // Leave Travel Allowance = 8.33% of Basic
  const leaveTravelAllowancePercentage = 8.33;
  const leaveTravelAllowance = Math.round(basicSalary * 0.0833);

  // Fixed Allowance = Remainder (Wage - (Basic + HRA + Standard + Bonus + LTA))
  const calculatedSum = basicSalary + houseRentAllowance + standardAllowance + performanceBonus + leaveTravelAllowance;
  const fixedAllowance = Math.max(0, wage - calculatedSum);

  // Provident Fund (PF) = 12% of Basic
  const pfPercentage = 12.0;
  const employeePf = Math.round(basicSalary * 0.12);
  const employerPf = Math.round(basicSalary * 0.12);

  // Professional Tax
  const professionalTax = wage > 15000 ? 200 : 0;

  const grossSalary = basicSalary + houseRentAllowance + standardAllowance + performanceBonus + leaveTravelAllowance + fixedAllowance;
  const netSalary = Math.max(0, grossSalary - (employeePf + professionalTax));

  return {
    wageType: "Fixed wage",
    monthlyWage: wage,
    yearlyWage,
    workingDaysPerWeek,
    workingHoursPerWeek,
    breakTimeMinutes,
    basicPercentage,
    basicSalary,
    hraPercentageOfBasic,
    houseRentAllowance,
    standardAllowance,
    performanceBonusPercentage,
    performanceBonus,
    leaveTravelAllowancePercentage,
    leaveTravelAllowance,
    fixedAllowance,
    pfPercentage,
    employeePf,
    employerPf,
    professionalTax,
    grossSalary,
    netSalary,
  };
}
