import { useEffect, useState } from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Font,
} from "@react-pdf/renderer";
import Header from "./Header";
import { fetchActivities } from "./fetchActivities";
import { ActivityType } from "../Activities/activityType";

Font.register({
  family: "Times New Roman",
  src: "/src/assets/times_new_roman.ttf",
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    fontFamily: "Times New Roman",
  },
  tutor: {
    fontSize: 10,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Times New Roman",
  },
  subtitle: {
    textTransform: "uppercase",
    fontSize: 10,
    marginBottom: 10,
    marginLeft: 15,
    fontFamily: "Times New Roman",
  },
  table: {
    flexDirection: "column",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 50,
    fontFamily: "Times New Roman",
  },
  tableRow: {
    flexDirection: "row",
    fontFamily: "Times New Roman",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    fontFamily: "Times New Roman",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textTransform: "uppercase",
    fontFamily: "Times New Roman",
  },
  activityList: {
    marginLeft: 10,
    fontFamily: "Times New Roman",
  },
  activityItem: {
    fontSize: 10,
    margin: 5,
    textTransform: "uppercase",
    fontFamily: "Times New Roman",
  },
  teacherName: {
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontFamily: "Times New Roman",
  },
  signatureLine: {
    marginHorizontal: 150,
    marginTop: 30,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontFamily: "Times New Roman",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 15,
    right: 15,
    fontSize: 5,
    textAlign: "left",
    borderTopWidth: 1,
    borderTopColor: "#8B0000",
    paddingTop: 5,
    fontFamily: "Times New Roman",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 10,
    right: 15,
    fontFamily: "Times New Roman",
  },
});

const Anexo11 = ({ student }) => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const getActivities = async () => {
      const data = await fetchActivities(student.idThesis);
      setActivities(data);
    };

    getActivities();
  }, [student.idThesis]);

  useEffect(() => {
    const getCurrentDate = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDate(`${year}-${month}-${day}`);
    };

    getCurrentDate();
  }, []);

  const groupActivitiesByMonth = (activities) => {
    const grouped = activities.reduce((acc, activity) => {
      const date = new Date(activity.dateActivity);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          activities: [],
          startDate: activity.dateActivity,
          endDate: activity.dateActivity,
        };
      }

      acc[key].activities.push(activity);
      acc[key].endDate = activity.dateActivity;

      return acc;
    }, {});

    const groups = Object.values(grouped).map((group) => ({
      startDate: group.startDate,
      endDate: group.endDate,
      activities: group.activities,
    }));

    if (groups.length > 0) {
      groups[0].startDate = groups[0].activities[0].dateActivity;
      groups[0].endDate =
        new Date(groups[0].endDate).toISOString().slice(0, 7) + "-31";
    }

    if (groups.length > 1) {
      for (let i = 1; i < groups.length - 1; i++) {
        const date = new Date(groups[i].startDate);
        groups[i].startDate = new Date(date.getFullYear(), date.getMonth(), 1)
          .toISOString()
          .slice(0, 10);
        groups[i].endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          .toISOString()
          .slice(0, 10);
      }
    }

    if (groups.length > 1) {
      const lastGroup = groups[groups.length - 1];
      const date = new Date(lastGroup.startDate);
      lastGroup.startDate = new Date(date.getFullYear(), date.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      lastGroup.endDate =
        lastGroup.activities[lastGroup.activities.length - 1].dateActivity;
    }

    return groups;
  };

  const groupedActivities = groupActivitiesByMonth(activities);

  return (
    <Document>
      <Page size="A4" style={{ position: "relative" }}>
        <Header
          student={student}
          tipo={"INFORME FINAL DEL AVANCE DEL TRABAJO DE TITULACIÓN"}
          numero={"11"}
        />
        <View style={styles.section}>
          <Text style={styles.subtitle}>{`FECHA: ${currentDate}`}</Text>
          <Text style={styles.subtitle}>
            {"NOMBRE DEL ESTUDIANTE: " + student.name}
          </Text>
          <Text style={styles.subtitle}>
            {"MODALIDAD DE TITULACIÓN: TESIS"}
          </Text>
          <Text style={styles.subtitle}>
            {"TEMA DEL TRABAJO DE TITULACIÓN: " + student.issue}
          </Text>
          <Text style={styles.subtitle}>
            {"FECHA DE APROBACIÓN DE LA PROPUESTA EN CONSEJO DIRECTIVO: " +
              student.approvalDate}
          </Text>
          <Text style={styles.subtitle}>
            {"PORCENTAJE FINAL DE AVANCE DE ACUERDO AL CRONOGRAMA: " +
              student.percentage +
              "%"}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>FECHA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ACTIVIDAD</Text>
              </View>
            </View>
            {groupedActivities.map((group, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {`Del ${new Date(
                      group.startDate
                    ).toLocaleDateString()} al ${new Date(
                      group.endDate
                    ).toLocaleDateString()}`}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <View style={styles.activityList}>
                    {group.activities.map((activity) => (
                      <Text
                        style={styles.activityItem}
                        key={activity.idActivity}
                      >
                        • {activity.description}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.signatureLine}></View>
          <Text
            style={[styles.teacherName]}
          >{`Ing. ${student.nameTeacher}`}</Text>
          <Text style={styles.tutor}>{"TUTOR TRABAJO TITULACIÓN"}</Text>
        </View>
        <View style={styles.footer}>
          <Text>
            INSTRUCTIVO DEL REGLAMENTO PARA LA TITULACIÓN DE GRADO EN LA
            UNIVERSIDAD TÉCNICA DE AMBATO
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default Anexo11;
