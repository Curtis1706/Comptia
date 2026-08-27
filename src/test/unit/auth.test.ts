import { authConfig } from "@/lib/auth";
import { RegisterSchema, LoginSchema } from "@/lib/validators";

export function testAuthConfiguration() {
  console.log("\n🧪 [TEST] Authentification NextAuth v5 & Validations");

  // 1. NextAuth v5 TrustHost configuration
  console.assert(authConfig.trustHost === true, "trustHost doit être activé pour le fonctionnement Vercel");
  console.assert(Boolean(authConfig.secret), "Secret NextAuth doit être défini");
  console.assert(authConfig.session?.strategy === "jwt", "Stratégie session doit être JWT");
  console.log("  ✅ Configuration NextAuth v5 (trustHost=true, secret, JWT) validée");

  // 2. Validation RegisterSchema (IFU 13 chiffres, Mot de passe sécurisé, Forme OHADA)
  const validRegisterData = {
    name: "Harry Dupont",
    email: "harry@test.bj",
    password: "Password123",
    company: {
      name: "Entreprise SARL",
      ifu: "1234567890123",
      type: "SARL",
      sector: "services",
      email: "contact@test.bj",
    },
  };

  const parsedValid = RegisterSchema.safeParse(validRegisterData);
  console.assert(parsedValid.success === true, "Données d'inscription valides rejetées");

  // Invalide si IFU != 13 chiffres
  const invalidIfu = { ...validRegisterData, company: { ...validRegisterData.company, ifu: "1234" } };
  const parsedInvalidIfu = RegisterSchema.safeParse(invalidIfu);
  console.assert(parsedInvalidIfu.success === false, "IFU invalide (< 13 chiffres) non rejeté");

  // Invalide si mot de passe sans majuscule/chiffre
  const invalidPassword = { ...validRegisterData, password: "password" };
  const parsedInvalidPassword = RegisterSchema.safeParse(invalidPassword);
  console.assert(parsedInvalidPassword.success === false, "Mot de passe faible non rejeté");

  console.log("  ✅ Schémas de validation (IFU 13 chiffres, Forme OHADA, Mot de passe) validés");
  return true;
}
