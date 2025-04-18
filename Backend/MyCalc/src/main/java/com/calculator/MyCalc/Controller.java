package com.calculator.MyCalc;
import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import com.calculator.MyCalc.RegisterDTO;
import com.calculator.MyCalc.LoginDTO;

@RestController
@RequestMapping("/calc")
public class Controller {

    private static final Logger logger = LoggerFactory.getLogger(Controller.class);

    @Autowired
    private CalculationService service;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    

    private ResponseEntity<CalculatorEntity> performOperation(String operationtype, double value1, double value2, String methodType) throws Exception
    {
        logger.info("{} request received for operation: {}, value1: {}, value2: {}", methodType, operationtype, value1, value2);
        CalculatorEntity results = service.operation(operationtype, value1, value2);
        logger.info("{} request result: {}", methodType, results);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/{operationtype}")
    public ResponseEntity<CalculatorEntity> m1(@PathVariable String operationtype, @RequestParam double value1, @RequestParam double value2) throws Exception {
        logger.info("POST Request: OperationType={}, Value1={}, Value2={}", operationtype, value1, value2);
        
        ResponseEntity<CalculatorEntity> response;
        try {
            response = performOperation(operationtype, value1, value2, "POST");
            logger.info("POST Operation successful: {}", response.getBody());
        } catch (Exception e) {
            logger.error("Error performing POST operation {}: {}", operationtype, e.getMessage());
            throw e;
        }
        
        return response;
    }

    @GetMapping("/{operationtype}")
    public ResponseEntity<CalculatorEntity> m1Get(@PathVariable String operationtype, @RequestParam double value1, @RequestParam double value2) throws Exception {
        logger.info("GET Request: OperationType={}, Value1={}, Value2={}", operationtype, value1, value2);
        
        ResponseEntity<CalculatorEntity> response;
        try {
            response = performOperation(operationtype, value1, value2, "GET");
            logger.info("GET Operation successful: {}", response.getBody());
        } catch (Exception e) {
            logger.error("Error performing GET operation {}: {}", operationtype, e.getMessage());
            throw e;
        }
        
        return response;
    }

    @GetMapping("/history")
    public List<CalculatorEntity> getCal_History1() {
        return service.getCal_History();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser ( @Valid @RequestBody RegisterDTO registerDto,BindingResult result) {
        
    	if(result.hasErrors()) {
    		String errorMessage=result.getFieldErrors().get(0).getDefaultMessage();
    		return ResponseEntity.badRequest().body(Map.of("error",errorMessage));
    	}
    			try {
    				  User_Data user = new User_Data();
    		            user.setUsername(registerDto.getUsername());
    		            user.setPassword(registerDto.getPassword()); // Will be hashed in service
    		            user.setRole(registerDto.getRole());
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser( @Valid @RequestBody LoginDTO loginDto,BindingResult result) {
        logger.info("Request received at /calc/login");

         if(result !=null && result.hasErrors())
         {
        	 String errorMessage = result.getFieldErrors().get(0).getDefaultMessage();
        	 return ResponseEntity.badRequest().body(Map.of("message", "Validation failed :" + errorMessage));
        			
         }
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            // Extract user role
            String role = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElseThrow(() -> new IllegalStateException("User has no roles assigned"));
                    
                    

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("role", role);
            response.put("token", jwt); // Include JWT in the response
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for username: {}", loginDto.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }
 
    @GetMapping("/auth-status")
    public ResponseEntity<String> checkAuthStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            logger.info("User is authenticated: {}", authentication.getName());
            return ResponseEntity.ok("Authenticated as: " + authentication.getName());
        } else {
            logger.info("User is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
    }


}
