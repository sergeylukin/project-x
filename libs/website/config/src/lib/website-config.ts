import { isProd } from '@depla/utils-environment';
import { config as generatedConfig } from '@sergeylukin/website/generated/config';

export const config = {
  ...generatedConfig,
  ...{
    title: `website title ${isProd ? 'production' : 'not production'}`,
    description:
      '🚀 website description',

    defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"

    googleAnalyticsId: false, // or "G-XXXXXXXXXX",
    googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
  }
};
