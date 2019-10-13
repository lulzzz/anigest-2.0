import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { WorkHours } from '../classes/work-hours';
import { Timeslot } from '../classes/timeslot';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  private eventStartingDate = new BehaviorSubject(Date)
  private groupQuantity = new BehaviorSubject(Number)
  private hoursOfWork = new BehaviorSubject(WorkHours)
  private slots = new BehaviorSubject(Timeslot)
  private maxId = new BehaviorSubject(Number)
  private timeslotId = new BehaviorSubject(Number)
  private pautasSubject = new BehaviorSubject(Array)
  private _listeners = new BehaviorSubject(String)

  constructor() { }
  eventDate: Date
  workHours: WorkHours[]
  groupAmount: number
  timeslots: any[]
  highestGroupId: number
  idTimeslot: number
  pautasArray: any[]
  
  setChosenTimeslotId(timeslotId) {
    localStorage.setItem('timeslotId', JSON.stringify(timeslotId))
  }

  getChosenTimeslotId() {
    let id = localStorage.getItem('timeslotId') as string
    return id
  }

  defineWorkHours(workHours: WorkHours[]) {
    this.hoursOfWork.subscribe(() => this.workHours = workHours)
  }

  defineHighestGroupId(id: number) {
    const newId = id
    this.maxId.subscribe(() => this.highestGroupId = newId)
  }

  defineTimeslots(timeslots: any[]) {
    this.slots.subscribe(() => this.timeslots = timeslots)
  }

  defineChosenTimeslot(timeslotId) {
    this.timeslotId.subscribe(() => this.idTimeslot = timeslotId)
  }

  defineDate(date: Date) {
    const newDate = date
    this.eventStartingDate.subscribe(() => this.eventDate = newDate)
  }

  defineGroupAmount(groups: number) {
    const groupNumber = groups
    this.groupQuantity.subscribe(() => this.groupAmount = groupNumber)
  }

  definePautas(pautas) {
    this.pautasSubject.subscribe(() => this.pautasArray = pautas)
  }

  undefineShareService() {
    this.highestGroupId = null
    this.groupAmount = 0
  }

}
