import { Line } from "react-chartjs-2";
import {
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  AssessmentOutlined,
  BarChartOutlined,
  SchoolOutlined,
  ShieldOutlined,
  TouchAppOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import "../styles/Animations.css";
import Copyright from "./Copyright";

function Welcome() {
  // Helper function to format the date
  const formatDate = (date) => {
    // Converts "Fri 02 Feb 2024 05:00:00 GMT" to "02 Feb '24"
    let withoutYear = date.toDateString().split(" ").slice(1, 3).join(" ");
    let year = date.getFullYear().toString().slice(2);
    return withoutYear + " '" + year;
  };

  // Generate dates starting from 10 days ago
  const generateDates = () => {
    let dates = [];
    let today = new Date();
    for (let i = 9; i >= 0; i--) {
      let date = new Date(today.setDate(today.getDate() - 1));
      dates.push(formatDate(date));
    }
    return dates.reverse();
  };

  const labels = generateDates();

  const cardStyles = {
    height: "100%",
    backgroundColor: "var(--primary-color) !important",
    color: "var(--text-color)",
    "&:hover": {
      outline: "2px solid var(--profit-color)",
    },
    transition: "transform 0.5s",
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stock Price Journey",
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (US $)",
        },
        grid: {
          display: true,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
    maintainAspectRatio: false,
  };

  const stockData = [100, 105, 110, 116, 123, 130, 138, 145, 153, 160];

  const stockDataBasic = [100, 101, 102, 103, 103, 104, 104, 105, 106, 107];

  const chartData = {
    labels: labels,
    datasets: [
      {
        pointStyle: "triangle",
        label: "Guided Path to Profit",
        data: stockData,
        borderColor: "rgb(75, 192, 75)",
        backgroundColor: "rgba(75, 192, 75, 0.5)",
      },
      {
        label: "Basic Performance",
        data: stockDataBasic,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "var(--primary-color)", padding: "5px" }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
            }}
          >
            PhantomPortfolio
          </Typography>
          <Button
            color="inherit"
            href="/phantom-portfolio/login"
            sx={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              "&:hover": {
                transform: "scale(1.1) rotate(-5deg)",
                backgroundColor: "var(--bg-color)",
              },
              marginRight: "10px",
              transition: "transform 0.5s",
            }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            href="/phantom-portfolio/register"
            sx={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              "&:hover": {
                transform: "scale(1.1) rotate(-5deg)",
                backgroundColor: "var(--bg-color)",
              },
              transition: "transform 0.5s",
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            mt: 4,
            mb: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2" gutterBottom>
              Welcome to{" "}
              <Typography
                variant="h2"
                sx={{
                  color: "var(--profit-color)",
                }}
              >
                PhantomPortfolio
              </Typography>
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Explore the world of stock trading without risk. Learn, simulate,
              and gain invaluable insights in a completely safe environment.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              raised
              sx={{
                height: "100%",
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
                outline: "2px solid var(--profit-color)",
                transform: "rotate(-3deg)",
                "&:hover": {
                  transform: "rotate(0)",
                },
                transition: "transform 0.5s",
                animation: "fadeIn 1s ease-in-out",
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                }}
              >
                <Line
                  data={chartData}
                  options={chartOptions}
                  style={{ width: "100%", height: "100%" }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          sx={{
            mt: 4,
            mb: 4,
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <SchoolOutlined
                    sx={{
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Learn and Experiment
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  PhantomPortfolio allows you to try numerous trading strategies
                  using data that mirrors real-world stock movements. Experiment
                  in a sandbox where{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    {" "}
                    your capital remains safe{" "}
                  </span>
                  , enabling you to focus on learning the nuances of market
                  fluctuations{" "}
                  <span style={{ color: "var(--loss-color)" }}>
                    without the fear of losing money
                  </span>
                  . This is your playground for financial growth where each
                  strategy can be honed to perfection with zero risk.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <TrendingUpOutlined
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Realistic Market Simulation
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  Dive into a virtual market environment that accurately
                  replicates real-time economic scenarios.
                  PhantomPortfolio&apos;s advanced algorithms ensure that{" "}
                  <span style={{ color: "var(--loss-color)" }}>
                    {" "}
                    you experience the volatility{" "}
                  </span>{" "}
                  and opportunities of the stock market,{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    preparing you for real-world investing
                  </span>
                  . Learn how market forces interact and develop your ability to
                  forecast potential market movements and react proactively.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <BarChartOutlined
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Comprehensive Analytics
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  Harness the power of professional-grade analytics tools that{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    dissect complex market data into actionable insights.
                  </span>{" "}
                  From novice to expert traders, our comprehensive suite of
                  tools offers deep dives into performance metrics, trend
                  analyses, and predictive modeling, all designed to elevate
                  your trading strategy to new heights. Empower yourself with
                  knowledge that leads to wiser investments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <TouchAppOutlined
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Interactive Learning
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  Step into a learning module{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    where every lesson is an interactive experience
                  </span>
                  . Engage with dynamic tutorials that{" "}
                  <span style={{ color: "var(--loss-color)" }}>
                    {" "}
                    challenge you to apply what you&apos;ve learned{" "}
                  </span>{" "}
                  in simulated trading scenarios. Each tutorial is designed to
                  adapt to your learning pace and style, enhancing your ability
                  to navigate the complexities of the stock market with
                  confidence. Prepare to transform your theoretical knowledge
                  into practical trading prowess.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <ShieldOutlined
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Safe Trading Environment
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  Experience the{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    {" "}
                    thrill of trading without the risk{" "}
                  </span>{" "}
                  in PhantomPortfolio&apos;s safe trading environment. Here, you
                  can push the boundaries of your investment strategies,{" "}
                  <span style={{ color: "var(--loss-color)" }}>
                    test aggressive tactics, or refine conservative approaches
                  </span>
                  —all without risking a dime. This is the perfect setting to
                  experiment, learn from mistakes, and build confidence before
                  entering the real markets. Our platform ensures that your
                  journey into the world of trading is both educational and
                  completely secure.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& *": {
                backgroundColor: "var(--primary-color) !important",
                color: "var(--text-color)",
              },
            }}
          >
            <Card raised sx={cardStyles}>
              <CardContent>
                <Typography variant="h4">
                  <AssessmentOutlined
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "2rem",
                      marginRight: "10px",
                    }}
                  />
                  Portfolio Analytics
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                  }}
                >
                  Unlock the full potential of your investment portfolio with
                  our advanced analytics tools. PhantomPortfolio provides
                  detailed insights into your portfolio&apos;s performance,
                  highlighting trends,{" "}
                  <span style={{ color: "var(--loss-color)" }}>risks, </span>and
                  opportunities. Analyze asset allocations, track returns over
                  various time frames, and receive tailored advice on how to
                  optimize your holdings based on your financial goals and risk
                  appetite. Empower yourself with data-driven insights to{" "}
                  <span style={{ color: "var(--profit-color)" }}>
                    {" "}
                    build a more resilient and profitable portfolio.
                  </span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Copyright />
      <br />
    </Box>
  );
}

export default Welcome;
