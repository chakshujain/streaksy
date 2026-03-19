import { updatePreferencesSchema } from '../../../modules/preferences/validation/preferences.schema';

describe('preferences validation schema', () => {
  it('should accept valid full update', () => {
    const result = updatePreferencesSchema.safeParse({
      theme: 'dark',
      accent_color: '#ff5733',
      dashboard_layout: 'compact',
      show_streak_animation: false,
      show_heatmap: true,
      weekly_goal: 10,
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty object (all fields optional)', () => {
    const result = updatePreferencesSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept partial update', () => {
    const result = updatePreferencesSchema.safeParse({ theme: 'dark' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid hex color', () => {
    const result = updatePreferencesSchema.safeParse({ accent_color: 'red' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid hex color format', () => {
    const result = updatePreferencesSchema.safeParse({ accent_color: '#xyz' });
    expect(result.success).toBe(false);
  });

  it('should accept valid hex color', () => {
    const result = updatePreferencesSchema.safeParse({ accent_color: '#aaBBcc' });
    expect(result.success).toBe(true);
  });

  it('should reject weekly_goal less than 1', () => {
    const result = updatePreferencesSchema.safeParse({ weekly_goal: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject weekly_goal greater than 100', () => {
    const result = updatePreferencesSchema.safeParse({ weekly_goal: 101 });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer weekly_goal', () => {
    const result = updatePreferencesSchema.safeParse({ weekly_goal: 5.5 });
    expect(result.success).toBe(false);
  });

  it('should reject non-boolean show_streak_animation', () => {
    const result = updatePreferencesSchema.safeParse({ show_streak_animation: 'yes' });
    expect(result.success).toBe(false);
  });
});
