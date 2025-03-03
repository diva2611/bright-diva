import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { CashRepository } from '../../repositories/cash/cash.repository';
import { MisFilterQueryDto, MisFilterType } from './dto/mis-filter-query.dto';
import { Op } from 'sequelize';
import { GenerateMisReportResDto } from './dto/generate-mis-report-data.res';
import { OrderRepository } from '../../repositories/order/order.repository';

@Injectable()
export class MisService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly orderRepository: OrderRepository,
    private readonly cashRepository: CashRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async generateMisReport(
    userId: string,
    misFilterQueryDto: MisFilterQueryDto,
  ): Promise<GenerateMisReportResDto> {
    try {
      const { fromDate, toDate, type, customerId } = misFilterQueryDto;
      const adminData = await this.adminRepository.findById(userId);

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let data;
      const filter: any = {};

      const dateFilter = {};
      if (fromDate) {
        dateFilter[Op.gte] = new Date(fromDate);
      }
      if (toDate) {
        dateFilter[Op.lte] = new Date(toDate);
      }

      if (fromDate && toDate) {
        filter.createdAt = dateFilter;
      }

      if (customerId) {
        filter.customerId = customerId;
      }

      switch (type) {
        case MisFilterType.INVOICE:
          data = await this.invoiceRepository.findAllByClause({
            where: filter,
          });
          break;
        case MisFilterType.ORDER:
          data = await this.orderRepository.findAllByClause({ where: filter });
          break;
        case MisFilterType.CASH:
          data = await this.cashRepository.findAllByClause({ where: filter });
          break;
        default:
          throw new BadRequestException('Invalid MIS report type');
      }

      if (!data || !data.length) {
        throw new NotFoundException('No records found for the given filters');
      }

      const formattedData = data.map((record) => record.dataValues);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`MIS Report for ${type}`);

      // Extract headers
      const headers = Object.keys(formattedData[0]);

      // Apply styles to headers
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } }; // White text
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '0070C0' }, // Blue background
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Auto-adjust column widths dynamically based on content
      const columnWidths = headers.map((header) => header.length + 5);

      // Add data rows with alternating row colors
      formattedData.forEach((record, rowIndex) => {
        const row = worksheet.addRow(Object.values(record));

        row.eachCell((cell, colNumber) => {
          // Apply border
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          // Alternate row colors
          if (rowIndex % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'EAF1FB' }, // Light blue for alternating rows
            };
          }

          // Wrap text and align properly
          cell.alignment = { wrapText: true, vertical: 'middle' };

          // Adjust column width dynamically
          const cellValue = String(cell.value);
          columnWidths[colNumber - 1] = Math.max(
            columnWidths[colNumber - 1],
            cellValue.length + 5,
          );
        });

        // Adjust row height for better visibility
        row.height = 20;
      });

      // Set final column widths
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      const reportsDir = path.join(process.cwd(), 'reports');

      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const fileName = `MIS_Report_${type}_${Date.now()}.xlsx`;
      const filePath = path.join(reportsDir, fileName);

      await workbook.xlsx.writeFile(filePath);

      const baseUrl = process.env.BASE_URL;
      const downloadUrl = `${baseUrl}/reports/${fileName}`;

      return { success: true, url: downloadUrl, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during generating mis report',
        error.message || error,
      );
    }
  }
}
