import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {ConnectionService} from "../../service/connection.service";


export const LoginAuthGuard: CanActivateFn = (route, state) => {
    console.log('LoginAuthGuard');

    const router = inject(Router);
    const connection = inject(ConnectionService);

    if(connection.ipaddress === undefined || connection.port === undefined) {
        console.log('LoginAuthGuard: no address');
        router.navigate(['/login']);
        return false;
    }
    if (!connection.getStatus()) {
        console.log('LoginAuthGuard: not connected');
        router.navigate(['/login'], {queryParams: {ip: connection.getAddress()}});
        return false;
    } else {
        console.log('LoginAuthGuard: connected');
        return true;
    }
}
