import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/estilos';
import { useThemeGlobal } from '../styles/ThemeContext';
import { getAppInfo, getCommitHash } from '../utils/commit';
import { useTranslation } from 'react-i18next';

export default function Sobre() {
  const { theme } = useThemeGlobal();
  const { t } = useTranslation();
  const { name, version } = getAppInfo();
  const commit = getCommitHash();
  const commitDisplay = commit && commit !== 'unknown' ? commit : t('about.unknown');
  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: 24, justifyContent: 'flex-start' }]}>
      <Text style={{ color: theme.primary, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
        {t('about.title')}
      </Text>
      <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 16 }}>
        <Text style={{ color: theme.text, fontSize: 16, marginBottom: 8 }}>
          {t('about.appName')}: <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        </Text>
        <Text style={{ color: theme.text, fontSize: 16, marginBottom: 8 }}>
          {t('about.version')}: <Text style={{ fontWeight: 'bold' }}>{version}</Text>
        </Text>
        <Text style={{ color: theme.text, fontSize: 16 }}>
          {t('about.commit')}: <Text style={{ fontFamily: 'monospace' }}>{commitDisplay}</Text>
        </Text>
      </View>
      <Text style={{ color: theme.text, fontSize: 12, marginTop: 12, opacity: 0.8, textAlign: 'center' }}>
        {t('about.hint')}
      </Text>
    </View>
  );
}
