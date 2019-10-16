import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }
  // ALVARÁ
  // Nº de Aluno (até 2 alunos em display)
  // Categoria de exame

  // AULAS TEÓRICAS (Exemplo)
  // Teórica
  // Cat. A x (lugares ocupados)
  // Cat. B x

  // Em caso de mais de 2 alunos ou vários alvarás
  // "x alunos"
  // Categoria de exame

  // Aula teórica em apenas um alvará
  // ALVARÁ
  // "x alunos"
  // Categoria de exame

  // No meio do ecrã, como background:
  // NÚMERO DA PAUTA SE HOUVER

  public day(event: CalendarEvent):string {
    // if ('1' === 'primeira') {
    //   return `alvará<br>nºs alunos<br>categoria de exame`
    // }
    if (typeof(event.meta.currentNumStudents) !== 'undefined') {
      if (event.meta.examType != null) {
        // 0 de 2
        // Prática Cat. A
        return `${event.meta.currentNumStudents} / ${event.meta.maxStudents}<br>
        ${event.meta.examType.Short}`
      }
      else {
        // if (event.meta.examType == 'Teórica') {
          // Teórica
          // Cat. A x
          // Cat. B y
        // }
        // 0
        // Tipo de exame 
        // não definido
        return ''
        // return `Tipo de exame<br> não definido`
      }
    }
    else {
      // Não Reservado
      return ''
    }
    // return `ola <br>${event.title}`
  }
}
