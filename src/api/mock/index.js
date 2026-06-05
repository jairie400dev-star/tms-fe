import { factories, employees, activity } from './data'

// In-memory mock store so create/update/delete feel real during a demo.
const db = {
  factories: factories.map((f) => ({ ...f })),
  employees: employees.map((e) => ({ ...e })),
  activity: activity.map((a) => ({ ...a })),
}

let nextFactoryId = 100
let nextEmployeeId = 100

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms))

export const mockApi = {
  async listFactories() {
    await delay()
    return db.factories.map((f) => ({ ...f }))
  },
  async getFactory(id) {
    await delay()
    return db.factories.find((f) => f.id === Number(id)) ?? null
  },
  async createFactory(payload) {
    await delay()
    const factory = { id: nextFactoryId++, employees_count: 0, ...payload }
    db.factories.unshift(factory)
    return factory
  },
  async updateFactory(id, payload) {
    await delay()
    const idx = db.factories.findIndex((f) => f.id === Number(id))
    if (idx >= 0) db.factories[idx] = { ...db.factories[idx], ...payload }
    return db.factories[idx]
  },
  async deleteFactory(id) {
    await delay()
    db.factories = db.factories.filter((f) => f.id !== Number(id))
    return true
  },

  async listEmployees() {
    await delay()
    return db.employees.map((e) => ({ ...e }))
  },
  async getEmployee(id) {
    await delay()
    return db.employees.find((e) => e.id === Number(id)) ?? null
  },
  async createEmployee(payload) {
    await delay()
    const factory = db.factories.find((f) => f.id === Number(payload.factory_id))
    const employee = { id: nextEmployeeId++, factory: factory?.name ?? '', ...payload }
    db.employees.unshift(employee)
    return employee
  },
  async updateEmployee(id, payload) {
    await delay()
    const idx = db.employees.findIndex((e) => e.id === Number(id))
    if (idx >= 0) db.employees[idx] = { ...db.employees[idx], ...payload }
    return db.employees[idx]
  },
  async deleteEmployee(id) {
    await delay()
    db.employees = db.employees.filter((e) => e.id !== Number(id))
    return true
  },

  async listActivity() {
    await delay()
    return db.activity.map((a) => ({ ...a }))
  },
}
