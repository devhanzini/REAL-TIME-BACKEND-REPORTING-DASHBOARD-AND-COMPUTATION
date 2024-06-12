import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LoanAnalysis {

    // Define the XNPV function
    public static double xnpv(double rate, double[] values, double[] dates) {
        double[] date_diffs = new double[dates.length];
        for (int i = 0; i < dates.length; i++) {
            date_diffs[i] = (dates[i] - dates[0]) / 365.0;
        }
        double sum = 0;
        for (int i = 0; i < values.length; i++) {
            sum += values[i] / Math.pow(1 + rate, date_diffs[i]);
        }
        return sum;
    }

    // Define the XIRR function
    public static double xirr(double[] values, double[] dates, double guess) {
        try {
            double xirrValue = newton((double r) -> xnpv(r, values, dates), guess);
            return xirrValue;
        } catch (Exception e) {
            e.printStackTrace();
            return Double.NaN;
        }
    }

    // Newton's method implementation
    public static double newton(Function function, double guess) throws Exception {
        double x0 = guess;
        double x1;
        double f0;
        double f1;
        double EPSILON = 1e-10;
        int MAX_ITERATIONS = 1000;
        int iterations = 0;

        do {
            f0 = function.calculate(x0);
            f1 = derivative(function, x0);
            if (f1 == 0) {
                throw new Exception("Derivative is zero.");
            }
            x1 = x0 - f0 / f1;
            if (++iterations > MAX_ITERATIONS) {
                throw new Exception("Maximum iterations reached.");
            }
            x0 = x1;
        } while (Math.abs(x1 - x0) > EPSILON);
        return x1;
    }

    // Derivative calculation for Newton's method
    public static double derivative(Function function, double x) {
        double h = 1e-5;
        return (function.calculate(x + h) - function.calculate(x)) / h;
    }

    // Function interface for mathematical functions
    interface Function {
        double calculate(double x);
    }

    public static void main(String[] args) {
        String dbURL = "jdbc:sqlserver://localhost:1433;databaseName=CBUReportDB;user=user;password=password";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            // Establish database connection
            conn = DriverManager.getConnection(dbURL);

            // Fetch data from the database
            String query = "SELECT * FROM [dbo].[AGRICULTURAL.LOANS]";
            stmt = conn.createStatement();
            rs = stmt.executeQuery(query);

            List<Double> datesList = new ArrayList<>();
            List<Double> cashflowsList = new ArrayList<>();

            // Process the result set
            while (rs.next()) {
                double date = rs.getDouble("Date");
                double cashflow = rs.getDouble("Amount");
                datesList.add(date);
                cashflowsList.add(cashflow);
            }

            // Convert lists to arrays
            double[] dates = datesList.stream().mapToDouble(Double::doubleValue).toArray();
            double[] cashflows = cashflowsList.stream().mapToDouble(Double::doubleValue).toArray();

            // Calculate XIRR for loan
            double xirrValue = xirr(cashflows, dates, 0.1);
            if (!Double.isNaN(xirrValue)) {
                System.out.println("XIRR: " + xirrValue);
            } else {
                System.out.println("XIRR calculation failed.");
            }

            // Perform further analysis and store results in another table if needed

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Close all database resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
