import {
  handleImageAlt,
  handleImageUrl,
  handleTime,
  transformByteToUnit,
} from "@/hooks";
import {
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import Image from "next/image";

interface Props {
  image?: EagleUse.Image;
  open?: boolean;
  onCancel?: () => void;
}

const ImageModal = ({ image, open, onCancel }: Props) => {
  const { token } = theme.useToken();
  if (!image) return;

  return (
    <>
      <style jsx global>
        {`
          .image-modal .ant-modal-content {
            padding: 0;
            overflow: hidden;
          }
        `}
      </style>
      <Modal
        className="image-modal"
        open={open}
        title={null}
        footer={null}
        width={"85%"}
        onCancel={onCancel}
        centered
        bodyStyle={{ height: "90vh", overflow: "hidden" }}
      >
        <Card
          style={{
            textAlign: "center",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
          title={
            <Row>
              <Col>
                <Typography.Text strong>{image.name}</Typography.Text>
              </Col>
              <Col offset={1}>
                <Tag color="red-inverse">{image.ext.toLocaleUpperCase()}</Tag>
                <Tag color="volcano-inverse">
                  {transformByteToUnit(image.size)}
                </Tag>
                <Tag color="orange-inverse">
                  {image.width} x {image.height}
                </Tag>
              </Col>
            </Row>
          }
          className="scroll-bar"
          headStyle={{
            position: "sticky",
            top: 0,
            backgroundColor: token.colorBgContainer,
            zIndex: 99,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "65vh",
              }}
            >
              <Image
                fill
                style={{ objectFit: "scale-down" }}
                src={handleImageUrl(image, true)}
                alt={handleImageAlt(image)}
              />
            </div>

            {image.tags.length > 0 && (
              <div style={{ width: "100%" }}>
                <Divider orientation="left">标签</Divider>
                <Space size={[0, 8]} style={{ width: "100%" }}>
                  {image.tags.map((item) => (
                    <Tag key={item.id}>{item.name}</Tag>
                  ))}
                </Space>
              </div>
            )}

            <Divider orientation="left">日期</Divider>
            <Space size={[0, 8]} style={{ width: "100%" }}>
              <Tag color="blue">添加日期：{handleTime(image.mtime)}</Tag>
              <Tag color="blue">创建日期：{handleTime(image.btime)}</Tag>
              <Tag color="blue">修改日期：{handleTime(image.lastModified)}</Tag>
            </Space>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default ImageModal;