import React, { useState } from "react";
import { Table, Tag, Avatar, Button } from "antd";
import type { TableColumnsType } from "antd";
import { DataType } from "./types";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import ModalInfo from "../components/Modal/ModalInfo";

interface ListStudentsProps {
  data: DataType[];
}

const ListStudents: React.FC<ListStudentsProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<DataType | null>(null);

  const showModal = (student: DataType) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const generateFilters = (data: DataType[], key: keyof DataType) => {
    const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
    return uniqueValues.map((value) => ({
      text: String(value),
      value: String(value),
    }));
  };

  const percentageFilters = [
    { text: "<50", value: "<50" },
    { text: "50", value: "50" },
    { text: ">50", value: ">50" },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      width: 20,
      render: (_, { name: firstname }) => (
        <Avatar
          size={24}
          src={`https://ui-avatars.com/api/?name=${firstname}`}
        />
      ),
    },
    {
      title: "Estudiante",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Carrera",
      dataIndex: "career",
      filters: generateFilters(data, "career"),
      onFilter: (value, record) => record.career === value,
      width: 150,
    },
    {
      title: "Estado",
      dataIndex: "state",
      filters: generateFilters(data, "state"),
      onFilter: (value, record) => record.state === value,
      render: (state) => {
        const color =
          state === "En curso"
            ? "blue"
            : state === "Retirado"
            ? "red"
            : "green";
        return (
          <Tag color={color} key={state}>
            {state}
          </Tag>
        );
      },
      width: 70,
    },
    {
      title: "Porcentaje",
      dataIndex: "percentage",
      width: 70,
      filters: percentageFilters,
      onFilter: (value, record) => {
        if (value === "<50") return record.percentage < 50;
        if (value === "50") return record.percentage === 50;
        if (value === ">50") return record.percentage > 50;
        return false;
      },
    },
    {
      width: 50,
      title: "Opciones",
      render: (student) => (
        <Button
          className="border-0 bg-transparent"
          onClick={() => showModal(student)}
        >
          <EditFilled />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        scroll={{ y: 650 }}
      />
      {selectedStudent && (
        <ModalInfo
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          student={selectedStudent}
        />
      )}
    </>
  );
};

export default ListStudents;
