import { z } from 'zod';
import type { Lead, LeadSource, LeadStatus } from './types';

/**
 * Schémas de validation Zod pour les données de l'application
 */

/**
 * Validation d'un email
 */
export const emailSchema = z.string().email('Email invalide').min(1, 'Email requis');

/**
 * Validation d'un téléphone français (optionnel)
 */
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(val),
    'Format de téléphone invalide (ex: +33 6 12 34 56 78)'
  );

/**
 * Schéma de validation pour un Lead
 */
export const leadSchema = z.object({
  id: z.string().optional(),
  created_at: z.string().optional(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(200, 'Le nom de société est trop long').optional(),
  project_type: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  message: z.string().max(2000, 'Le message est trop long').optional(),
  source: z.enum(['contact_form', 'wizard'] as const),
  status: z.enum(['new', 'contacted', 'negotiation', 'signed', 'lost'] as const),
  partner_id: z.string().nullable().optional(),
  deal_amount: z.number().positive('Le montant doit être positif').optional(),
  details: z.record(z.unknown()).optional(),
}) satisfies z.ZodType<Partial<Lead>>;

/**
 * Schéma pour la création d'un lead (sans id, created_at)
 */
export const createLeadSchema = leadSchema.omit({ id: true, created_at: true });

/**
 * Schéma pour la mise à jour d'un lead (tous les champs optionnels sauf id)
 */
export const updateLeadSchema = leadSchema.partial().required({ id: true });

/**
 * Schéma pour un partenaire
 */
export const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: emailSchema,
  commission_rate: z.number().min(0, 'Le taux doit être positif').max(100, 'Le taux ne peut pas dépasser 100%'),
  role: z.string().max(100).optional(),
});

/**
 * Schéma pour le formulaire de contact
 */
export const contactFormSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  email: emailSchema,
  phone: phoneSchema,
  project: z.string().min(1, 'Le type de projet est requis').max(100),
  budget: z.string().min(1, 'Le budget est requis').max(50),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(2000),
});

/**
 * Type inféré depuis le schéma de contact
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Valide les données d'un lead
 * @throws {z.ZodError} Si la validation échoue
 */
export function validateLead(data: unknown): Lead {
  return leadSchema.parse(data) as Lead;
}

/**
 * Valide les données d'un formulaire de contact
 * @throws {z.ZodError} Si la validation échoue
 */
export function validateContactForm(data: unknown): ContactFormData {
  return contactFormSchema.parse(data);
}

/**
 * Valide partiellement un lead (pour les mises à jour)
 */
export function validateLeadUpdate(data: unknown): Partial<Lead> {
  return updateLeadSchema.parse(data) as Partial<Lead>;
}
