import { useState, useEffect, useMemo } from "react";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
  onValidChange?: (isValid: boolean) => void;
}

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least 1 uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least 1 lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least 1 number", test: (p: string) => /[0-9]/.test(p) },
  { label: "At least 1 special character", test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

export function PasswordStrength({ password, onValidChange }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  
  const results = requirements.map(req => req.test(password));
  const validCount = results.filter(Boolean).length;
  const isValid = validCount === requirements.length;

  useEffect(() => {
    setStrength((validCount / requirements.length) * 100);
    onValidChange?.(isValid);
  }, [password, validCount, isValid, onValidChange]);

  const getStrengthColor = () => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 20) return "Very Weak";
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Fair";
    if (strength <= 80) return "Good";
    return "Strong";
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={isValid ? "text-green-500" : "text-yellow-500"}>
            {getStrengthText()}
          </span>
        </div>
        <Progress value={strength} className="h-2" indicatorClassName={getStrengthColor()} />
      </div>

      <div className="space-y-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {results[index] ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={results[index] ? "text-foreground" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}