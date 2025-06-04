import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// style untuk PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1a365d'
    },
    section: {
        marginBottom: 15
    },
    label: {
        fontSize: 10,
        color: '#718096',
        marginBottom: 3,
        fontWeight: 'bold'
    },
    content: {
        fontSize: 12,
        color: '#2d3748',
        textAlign: 'justify',
        lineHeight: 1.5
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    gridItem: {
        width: '48%',
        marginBottom: 15
    }
});

const CatatanKonselingDokumen = ({ catatan }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>CATATAN KONSELING</Text>
                <Text style={styles.label}>ID: {catatan.id}</Text>
            </View>

            <View style={styles.grid}>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>DESKRIPSI MASALAH</Text>
                    <Text style={styles.content}>{catatan.deskripsi_masalah || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>USAHA YANG DILAKUKAN</Text>
                    <Text style={styles.content}>{catatan.usaha || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>KENDALA</Text>
                    <Text style={styles.content}>{catatan.kendala || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>PENCAPAIAN</Text>
                    <Text style={styles.content}>{catatan.pencapaian || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>DIAGNOSIS</Text>
                    <Text style={styles.content}>{catatan.diagnosis || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>INTERVENSI</Text>
                    <Text style={styles.content}>{catatan.intervensi || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>TINDAK LANJUT</Text>
                    <Text style={styles.content}>{catatan.tindak_lanjut || '-'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>KONSELING LANJUTAN</Text>
                    <Text style={styles.content}>{catatan.konseling_lanjutan ? "Dibutuhkan" : "Tidak dibutuhkan"}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default CatatanKonselingDokumen;