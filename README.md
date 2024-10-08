# Project Yomi

Fullstack CMS E-commerce project

Status: Dropped - replaced by [p-robin](https://github.com/xREMAGIx/p-robin)

## Tech Stack

**Client**

- [Elysia - Eden](https://github.com/elysiajs/eden)
- [Tanstack Router](https://tanstack.com/router/latest/)
- [Tanstack React Query](https://tanstack.com/query/latest/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)

**Server**

- [Elysia](https://github.com/elysiajs/elysia)
- [Drizzle](https://drizzlekit.com/)

**Database**

- [PostgreSQL](https://www.postgresql.org/)

**Runtime**

- [Bun](https://bun.dev/)

## Features

#### Authentication

- [x] Login
- [x] Register
- [ ] Forgot password
- [ ] Logout

#### Dashboard

- [ ] How many orders (filters date range)
- [ ] Revenue
- [ ] Receivable
- [ ] Debt

#### Product

- [x] CRUD
- [x] Search by name, barcode
- [x] Show/hide columns, sort by API
- [x] Checkboxes in table for multiple selection
- [ ] Filter date range
- [x] Inline search column, sorting
- [x] Sticky multiple columns
- [x] Status: Draft, Published, End of Service
- [x] Add cost price for calculate profit.
- [x] Tracking who created, updated
- [ ] Show, clear applied filter
- [ ] Multiple prices: wholesale prices, web, ...
- [x] Can see inventory across warehouses
- [ ] Can have variety
- [ ] Import data using exel: xls
- [ ] Upload images
- [ ] Information for display in website
- [ ] Scan barcode to search for product

#### Warehouse

- [x] CRUD
- [ ] Can check if there’s any goods receipt, goods issue has been pending, completed

#### Goods receipt

- [x] CRUD
- [ ] Implement status: pending, completed
- [ ] Only when the status is completed will we update inventory
- [ ] Search, filter status

#### Goods issue

- [ ] CRUD
- [ ] Search, filter status

#### Transfer

- [ ] CRUD
- [ ] Search, filter status

#### Order

- [ ] CRUD
- [ ] Filter date range, status, add total row
- [ ] Can have multiple tabs at the same time

#### Customer

- [ ] CRUD

#### Employee

- [ ] CRUD
- [ ] Can assign to a department

#### Department

- [ ] CRUD
- [ ] Can see how many employee in it
- [ ] Total salary

#### Setting

- [x] Darkmode
- [x] Translation
- [ ] Define all translation text

#### Role

- [ ] CRUD

#### Permission

- [ ] Assign permission for roles

## Database

![Database img](database.png)

Generated using [TablePlus Diagram plugin](https://github.com/TablePlus/diagram-plugin)
