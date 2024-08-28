import {
  Card,
  CardHeader,
  IconButton,
  Collapse,
  CardContent,
  Container,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import dayjs from "dayjs";
import "./collapse_card.css";

function CollapseCard({
  title,
  date,
  data,
}: {
  title: string;
  date: string;
  data?: { id?: string; title?: string; value?: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card
        sx={{
          minWidth: 300,
          border: "1px solid rgba(211,211,211,0.6)",
        }}
      >
        <CardHeader
          titleTypographyProps={{variant: "h6"}}
          title={title}
          sx={{
            color: "#254AA8DE",
            paddingLeft: "40px"
          }}
          action={
            <IconButton
            onClick={() => setOpen(!open)}
            aria-label="expand"
            size="small"
            >
              {dayjs(date).format("MM/DD/YYYY")}
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        ></CardHeader>
        <div>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              <Container
                sx={{
                  // height: 100,
                  // overflow:'auto',
                  lineHeight: 2,
                }}
              >
                {data?.map((d) => {
                  return (
                    <div>
                      <p className="que">{d.title}</p>
                      <p className="ans">{d.value}</p>
                    </div>
                  );
                })}
              </Container>
            </CardContent>
          </Collapse>
        </div>
      </Card>
    </>
  );
}

export default CollapseCard;
