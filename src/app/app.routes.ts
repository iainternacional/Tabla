import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { EjemploComponent } from './ejemplo/ejemplo.component';

export const routes: Routes = [
  { path: '', component: EjemploComponent },
  { path: 'ejemplo', component: EjemploComponent }
];
